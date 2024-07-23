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



import os

app = Flask(__name__)
# SET UP CORS
CORS(app, origin='*');

# LOAD ENV
load_dotenv()

# CONFIGURE GEMINI 
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')
# SET APP SECRET KEY
app.secret_key = os.getenv('SECRET_KEY')
# SET GROQ API KEY FOR LANGCHAIN
os.environ['GROQ_API_KEY'] = os.getenv('GROQ_API_KEY');
# SET CONFIG FOR CSV BOT
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER');

def init_db(user, password, host, port, database):
    db_uri = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
    return SQLDatabase.from_uri(db_uri)

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
                print('VARS', vars['query']),  
                vars.update({"modified_query": vars["query"].replace('\\_', '_')}),  
                db.run(vars["modified_query"])
            )  
        )
        | prompt
        | llm.bind(stop=["\nSQL Result:"])
        | StrOutputParser()
    )
    return chain.stream({"question": user_query, "chat_history": chat_history})

@app.route('/connect', methods=['POST'])
def connect():
    data = request.json  # Get the JSON data from the request body
    print(data);
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
        session['db'] = {
            'user': user,
            'host': host,
            'port': port,
            'database': database
        }
        return jsonify({"status": "success"})
    except Exception as e:
        print("Not Done");
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    user_query = request.json['message']
    user = request.json['User']
    password = request.json['Password']
    host = request.json['Host']
    port = request.json['Port']
    database = request.json['Database']
    chat_history = session.get("chat_history", [])
    
    if user_query and user_query.strip() != "":
        chat_history.append(HumanMessage(content=user_query))
        db = init_db(user, password, host, port, database)
        if db:
            ai_response = get_response(user_query, db, chat_history)
            ans = ""
            for item in ai_response:
                ans += item 
            ans = ans.replace('\\_','_')
            chat_history.append(AIMessage(content=ans))
        else:
            ai_response = "Database connection not established."
            chat_history.append(AIMessage(content=ans))
        return jsonify({"response": ans})
    
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
    print("here")
    filename = 'uploaded_file.csv'
    print(filename)
    print("here")
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
    app.run(host='0.0.0.0', port=5000, debug=True)
