from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain_openai import ChatOpenAI, OpenAI
from flask_cors import CORS
from langchain_groq import ChatGroq
from flask import Flask, request, render_template, session, jsonify
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import pandas as pd
import os
import google.generativeai as genai
from tabulate import tabulate

app = Flask(__name__)
CORS(app, origin='*')
genai.configure(api_key="")
model = genai.GenerativeModel('gemini-pro')
app.secret_key = "supersecretkey"  # Make sure to set a secret key
load_dotenv()
fastapi_app = FastAPI()
UPLOAD_FOLDER = './files'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize the database connection
def init_db(user, password, host, port, database):
    db_uri = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
    return SQLDatabase.from_uri(db_uri)

# Get the SQL chain
def get_sql_chain(db):
    template = """
    You are a data analyst at a company. You are interacting with a user who is asking your question about the company's database.
    Based on the table schema below, write a SQL query that would answer the user's question. Take the conversation history into account.
    
    <SCHEMA>{schema}</SCHEMA>
    
    Conversation History: {chat_history}
    
    Write only the SQL query and nothing else. Do not wrap the SQL query in any other text, not even backticks.
    
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

# Get the response for the SQL query
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
            response=lambda vars: db.run(vars["query"])
        )
        | prompt
        | llm.bind(stop=["\nSQL Result:"])
        | StrOutputParser()
    )
    return chain.stream({"question": user_query, "chat_history": chat_history})

# Index route
@app.route('/')
def index():
    if "chat_history" not in session:
        session["chat_history"] = [
            AIMessage(content="Hello! I am a SQL Assistant. How can I help you? Ask me anything about your database....")
        ]
    return render_template('index.html', chat_history=session["chat_history"])

# Connect to the database
@app.route('/connect', methods=['POST'])
def connect():
    data = request.json  # Get the JSON data from the request body
    print(data)
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400

    user = data.get('User')
    password = data.get('Password')
    host = data.get('Host')
    port = data.get('Port')
    database = data.get('Database')

    if not all([user, password, host, port, database]):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    try:
        db = init_db(user, password, host, port, database)
        print(db)
        session['db_info'] = {
            'user': user,
            'host': host,
            'port': port,
            'database': database
        }
        print("Done")
        return jsonify({"status": "success"})
    except Exception as e:
        print("Not Done")
        return jsonify({"status": "error", "message": str(e)}), 500

# Chat route
@app.route('/chat', methods=['POST'])
def chat():
    user_query = request.json['message']
    chat_history = session.get("chat_history", [])
    
    if user_query and user_query.strip() != "":
        chat_history.append(HumanMessage(content=user_query))
        db = session.get('db')
        
        if db:
            ai_response = get_response(user_query, db, chat_history)
            chat_history.append(AIMessage(content=ai_response))
        else:
            ai_response = "Database connection not established."
            chat_history.append(AIMessage(content=ai_response))
        
        session["chat_history"] = chat_history
        return jsonify({"response": ai_response})
    
    return jsonify({"response": ""})

# Report route
@app.route('/report', methods=['POST'])
def report():
    data = request.json  # Get the JSON data from the request body
    print(data)
    
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400

    user = data.get('User')
    password = data.get('Password')
    host = data.get('Host')
    port = data.get('Port')
    database = data.get('Database')

    if not all([user, password, host, port, database]):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    try:
        # Initialize the database connection
        db = init_db(user, password, host, port, database)
        print("Database connected")
        
        # Define the constant prompt to get table schema and relationships
        prompt_text = "Give me the datatypes of each table field and relationships between the tables in the database."
        
        # Define a function to get the schema information
        def get_schema_info(_):
            return db.get_table_info()

        # Define the prompt template and model for generating the schema description
        schema_prompt = ChatPromptTemplate.from_template(prompt_text)
        llm = ChatGroq(model="Mixtral-8x7b-32768", temperature=0)
        
        # Create the chain to generate the schema description
        schema_chain = (
            RunnablePassthrough.assign(schema=get_schema_info)
            | schema_prompt
            | llm.bind(stop=["\nSQL Result:"])
            | StrOutputParser()
        )
        
        # Get the response from the model
        schema_description = schema_chain.stream({"question": prompt_text, "chat_history": []})
        
        # Store the response in a variable and return it
        postfix = {"schema_description": schema_description}
        query=f"give me 4 vulnerabilities in the schema descriptions given below of a database {postfix}"

        result = model.generate_content(query)


        response = result.text

        return jsonify(response)
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500

# CSV upload route
@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400
    
    if file:
        filename = 'uploaded_file.csv'
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)  # This will overwrite the file if it already exists
        session['uploaded_filename'] = filename  # Store the filename in the session

        return jsonify({"status": "success", "message": "File uploaded successfully", "filename": filename}), 200

# CSV manipulation route
@app.route('/chatCSV', methods=['POST'])
def manipulate_csv():
    filename = session.get('uploaded_filename')
    
    if not filename:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    llm = OpenAI(temperature=0, openai_api_key='')
    try:
        print("hello")
        agent = create_csv_agent(llm, filepath, verbose=True, allow_dangerous_code=True)
        
        prompt = request.json.get('prompt')
        if prompt:
            response = agent.run(prompt)
            return jsonify({"status": "success", "response": response}), 200
        else:
            return jsonify({"status": "error", "message": "No prompt provided"}), 400

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run()
