from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from flask_cors import CORS
from langchain_groq import ChatGroq
from flask import Flask, request, render_template, session, jsonify
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import pandas as pd

import os

app = Flask(__name__)
CORS(app, origin='*');
app.secret_key = "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"
load_dotenv()
fastapi_app = FastAPI()

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
            response=lambda vars: db.run(vars["query"])
        )
        | prompt
        | llm.bind(stop=["\nSQL Result:"])
        | StrOutputParser()
    )
    return chain.stream({"question": user_query, "chat_history": chat_history})

@app.route('/')
def index():
    if "chat_history" not in session:
        session["chat_history"] = [
            AIMessage(content="Hello! I am a SQL Assistant. How can I help you? Ask me anything about your database....")
        ]
    return render_template('index.html', chat_history=session["chat_history"])

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
        print(db);
        session['db_info'] = {
            'user': user,
            'host': host,
            'port': port,
            'database': database
        }
        print("Done");
        return jsonify({"status": "success"})
    except Exception as e:
        print("Not Done");
        return jsonify({"status": "error", "message": str(e)}), 500

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

# FastAPI endpoint for querying CSV files
@fastapi_app.post("/query-csv/")
async def query_csv(file: UploadFile = File(...), question: str = Form(...)):
    if file.content_type != 'text/csv':
        return JSONResponse(content={"error": "Invalid file type. Only CSV files are supported."}, status_code=400)

    content = await file.read()
    csv_data = StringIO(content.decode('utf-8'))
    csv_df = pd.read_csv(csv_data)

    agent = create_csv_agent(OpenAI(temperature=0), csv_df, verbose=True)

    try:
        response = agent.run(question)
        return JSONResponse(content={"response": response})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# WSGI integration
from fastapi.middleware.wsgi import WSGIMiddleware
app.wsgi_app = WSGIMiddleware(fastapi_app, app.wsgi_app)

if __name__ == '__main__':
    app.run(debug=True)
