from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from flask_cors import CORS
from langchain_groq import ChatGroq
from flask import Flask, request, session, jsonify
from langchain_experimental.agents.agent_toolkits import create_csv_agent
import google.generativeai as genai
from langchain import OpenAI
import re
import os
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
from urllib.parse import urlparse
from cryptography.fernet import Fernet  
import random
import schedule
import time
import threading

app = Flask(__name__)

CORS(app, origin="*")

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

TIME_DELTA = timedelta(hours=2)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app).db

app.secret_key = os.getenv("SECRET_KEY")

app.config["UPLOAD_FOLDER"] = os.getenv("UPLOAD_FOLDER")

key = Fernet.generate_key()
cipher_suite = Fernet(key)

if "Logs" not in mongo.list_collection_names():
    mongo.create_collection("Logs")

def encrypt_data(data):
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data):
    return cipher_suite.decrypt(encrypted_data.encode()).decode()

def parse_db_uri(db_uri):
    parsed_uri = urlparse(db_uri)
    user = parsed_uri.username
    password = parsed_uri.password
    host = parsed_uri.hostname
    port = parsed_uri.port
    database = parsed_uri.path.lstrip("/")

    return {
        "user": user,
        "password": password,
        "host": host,
        "port": port,
        "database": database,
    }


def init_db(user, password, host, port, database):
    db_uri = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
    return db_uri


def parse_user_agent(user_agent):
    """
    A basic function to parse the User-Agent string.
    This can be replaced with a more sophisticated parser if needed.
    """
    if not user_agent:
        return "Unknown device"

    if "Windows" in user_agent:
        os = "Windows"
    elif "Macintosh" in user_agent:
        os = "Mac OS"
    elif "Linux" in user_agent:
        os = "Linux"
    else:
        os = "Other"

    if "Mobile" in user_agent:
        device = "Mobile"
    else:
        device = "Desktop"

    return f"{os} - {device}"


def generator():
    return random.randint(10000000, 99999999)


def get_sql_chain(db):
    template = """
    You are a data analyst at a company. You are interacting with a user who is asking your question about the company's database.
    Based on the table schema below, write a SQL query that would answer the user's question. Take the conversation history into account.
    
    <SCHEMA>{schema}</SCHEMA>
    
    Conversation History: {chat_history}
    
    Write only the SQL query and nothing else. Do not wrap the SQL query in any other text, not even backticks.
    Do not add any backslashes before underscores in table or column names. In case even in the schema there are any table or database whose name has a \_ like this simply add _ in query not the backslash.
    
    for example:
    Question: which 3 artists have the most tracks?
    SQL Query: SELECT ArtistId, COUNT(*) FROM tracks GROUP BY ArtistId ORDER BY COUNT(*) DESC LIMIT 3;
    Question: Name 10 artists
    SQL Query: SELECT Name FROM artists LIMIT 10;
    
    Your turn:
    
    Question: {question}
    SQL Query:
    """

    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatGroq(model="Mixtral-8x7b-32768", temperature=0)

    def get_schema(_):
        return db.get_table_info()

    return (
        RunnablePassthrough.assign(schema=get_schema)
        | prompt
        | llm.bind(stop=["\nSQL Result:"])
        | StrOutputParser()
    )


def get_response(user_query, db, chat_history):
    sql_chain = get_sql_chain(db)

    template = """
    You are a data analyst at a company. You are interacting with a user who is asking your question about the company's database.
    Based on the table schema below, question, sql query, and sql response, write a natural language response.
    <SCHEMA>{schema}</SCHEMA>
    
    Conversational History: {chat_history}
    SQL Query: <SQL>{query}</SQL>
    User Question: {question}
    SQL Response {response}
    """

    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatGroq(model="Mixtral-8x7b-32768", temperature=0)

    chain = (
        RunnablePassthrough.assign(query=sql_chain).assign(
            schema=lambda _: db.get_table_info(),
            response=lambda vars: (
                print("VARS", vars["query"]),
                vars.update({"modified_query": vars["query"].replace("\\_", "_")}),
                db.run(vars["modified_query"]),
            ),
        )
        | prompt
        | llm.bind(stop=["\nSQL Result:"])
        | StrOutputParser()
    )
    return chain.stream({"question": user_query, "chat_history": chat_history})


@app.route("/connect", methods=["POST"])
def connect():
    data = request.json
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400

    user = data.get("User")
    password = data.get("Password")
    host = data.get("Host")
    port = data.get("Port")
    database = data.get("Database")

    if not all([user, password, host, port, database]):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    try:
        db_uri = init_db(user, password, host, port, database)
        schema_description = SQLDatabase.from_uri(db_uri).get_table_info()
        prompt = f"Convert the following table information into a JSON object. Format is table names, then the column name and datatype. Dont add any space or backslash.The table info is:\n\n{schema_description}"

        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)

        response_text = response.text.replace("\n", "").replace("\\", "")

        cleaned_response = response_text.strip("```pythontables = ")
        no_spaces = re.sub(r"\s+", "", cleaned_response)
        replaced_response = no_spaces.replace("'", '""')
        final_string = ""
        for ch in replaced_response:
            if ch != "\\":
                final_string += ch
        db_uri = encrypt_data(db_uri)
        return jsonify(
            {"status": "success", "schema_description": final_string, "db": db_uri}
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    user_query = request.json["message"]
    db_uri = request.json["db"]
    chat_history = session.get("chat_history", [])

    if request.headers.getlist("X-Forwarded-For"):
        user_ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        user_ip = request.remote_addr

    user_agent = request.headers.get("User-Agent")

    device_info = parse_user_agent(user_agent)

    if user_query and user_query.strip() != "":
        chat_history.append(HumanMessage(content=user_query))
        db = SQLDatabase.from_uri(decrypt_data(db_uri))
        if db:
            ai_response = get_response(user_query, db, chat_history)
            ans = ""
            for item in ai_response:
                ans += item
            ans = ans.replace("\\_", "_")
            print("ANS", ans)
            chat_history.append(AIMessage(content=ans))
            db = parse_db_uri(db_uri)
            collection = mongo["Logs"]
            document = {
                "device": device_info,
                "user_ip": user_ip,
                "user": db.get("user"),
                "host": db.get("host"),
                "port": db.get("port"),
                "database": db.get("database"),
                "query": user_query,
                "response": ans,
                "createdAt": datetime.utcnow(),
            }
            collection.insert_one(document)
        else:
            response = "Database connection not established."
            chat_history.append(AIMessage(content=response))
        return jsonify({"response": ans})

    return jsonify({"response": ""})


@app.route("/fetch-table", methods=["POST"])
def fetch_tables():
    data = request.json
    user = data.get("User")
    password = data.get("Password")
    host = data.get("Host")
    port = data.get("Port")
    database = data.get("Database")

    if not all([user, password, host, port, database]):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    try:
        db = init_db(user, password, host, port, database)
        print("Database connected")

        tables_info = db.get_table_info()
        prompt = f"Convert the following table information into a JSON object. Format is table names, then the column name and datatype. Dont add any space or backslash.The table info is:\n\n{tables_info}"

        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)

        response_text = response.text.replace("\n", "").replace("\\", "")

        cleaned_response = response_text.strip("```pythontables = ")
        no_spaces = re.sub(r"\s+", "", cleaned_response)
        replaced_response = no_spaces.replace("'", '""')
        final_string = ""
        for ch in replaced_response:
            if ch != "\\":
                final_string += ch
        return jsonify({"status": "success", "tables_info": final_string}), 200

    except Exception as e:
        print("Error - ", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/fetch-table-data", methods=["POST"])
def fetch_table_data():
    data = request.json
    table = data.get("table")
    first_column = data.get("first_column")
    second_column = data.get("second_column")
    user = data.get("User")
    password = data.get("Password")
    host = data.get("Host")
    port = data.get("Port")
    database = data.get("Database")
    type = data.get("Type")
    option = data.get("Option")

    if not all(
        [user, password, host, port, database, table, first_column, second_column]
    ):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    try:
        db = init_db(user, password, host, port, database)
        print("Database connected")
        if type != "Line":
            option = int(option)
            segment = f"SUM({second_column})" if option != 1 else "COUNT(*)"
            sql_query_first = f"SELECT DISTINCT {first_column} AS {first_column} FROM {table} ORDER BY {first_column} ASC"
            sql_query_second = f"SELECT {segment} AS {second_column} FROM {table} GROUP BY {first_column} ORDER BY {first_column} ASC"
        else:
            sql_query_first = f"SELECT {first_column} FROM {table};"
            sql_query_second = f"SELECT {second_column} FROM {table};"

        first_column_data = db.run(sql_query_first)
        second_column_data = db.run(sql_query_second)

        def replace_consecutive_commas(input_string):
            result = []
            i = 0
            length = len(input_string)
            while i < length:
                if input_string[i] == ",":
                    if i + 1 < length and input_string[i + 1] == ",":
                        while i + 1 < length and input_string[i + 1] == ",":
                            i += 1
                    result.append(",")
                else:
                    result.append(input_string[i])
                i += 1
            return "".join(result)

        def clean_and_format_data(data):
            result = ""
            for row in data:
                concatenated = "".join(
                    str(element).strip() for element in row if element is not None
                )
                for char in concatenated:
                    if char == "(":
                        continue
                    elif char == ")":
                        if result and not result.endswith(","):
                            result += ", "
                    else:
                        result += char
            result = result.rstrip(", ").strip()
            result = result.replace(" ", "")
            result = result.replace(",,", ",")
            result = replace_consecutive_commas(result)
            result = result.replace("Decimal", "")
            return result[:-2] + result[-1]

        first_data = clean_and_format_data(first_column_data)
        second_data = clean_and_format_data(second_column_data)
        formatted_first_data = f"{first_data}"
        formatted_second_data = f"{second_data}"
        return (
            jsonify(
                {
                    "status": "success",
                    first_column: formatted_first_data,
                    second_column: formatted_second_data,
                }
            ),
            200,
        )

    except Exception as e:
        print("Error - ", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/upload_csv", methods=["POST"])
def upload_csv():
    if "file" not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400

    file = request.files["file"]
    if file:
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{file.filename}_{generator()}_{timestamp}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "File uploaded successfully",
                    "file": filename,
                }
            ),
            200,
        )
    else:
        return (
            jsonify({"status": "false", "message": "Please provide a file"}),
            500,
        )


@app.route("/chat_csv", methods=["POST"])
def manipulate_csv():
    data = request.json
    prompt = data.get("prompt")
    filename = data.get("file")
    if not filename:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    llm = OpenAI(temperature=0, openai_api_key="")
    try:
        agent = create_csv_agent(llm, filepath, verbose=True, allow_dangerous_code=True)
        if prompt:
            response = agent.run(prompt)
            return jsonify({"status": "success", "response": response}), 200
        else:
            return jsonify({"status": "error", "message": "No prompt provided"}), 400

    except Exception as e:
        print("Error - ", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500


def delete_old_files():
    now = datetime.now()
    for filename in os.listdir(app.config["UPLOAD_FOLDER"]):
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file_mtime = datetime.fromtimestamp(os.path.getmtime(filepath))
        if now - file_mtime > TIME_DELTA:
            os.remove(filepath)
            print(f"Deleted {filename}")


def schedule_tasks():
    schedule.every(1).hour.do(delete_old_files)
    while True:
        schedule.run_pending()
        time.sleep(1)


if __name__ == "__main__":

    threading.Thread(target=schedule_tasks, daemon=True).start()

    app.run(host="0.0.0.0", port=5000, debug=True)
