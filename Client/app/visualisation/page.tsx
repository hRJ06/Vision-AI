"use client"
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
//   ```{
//     "announcements": {
//       "id": "INTEGER",
//       "content": "VARCHAR(255)",
//       "course_id": "INTEGER",
//       "name": "VARCHAR(255)"
//     },
//     "assignments": {
//       "id": "INTEGER",
//       "assignment_name": "VARCHAR(255)",
//       "deadline": "DATETIME(6)",
//       "description": "VARCHAR(255)",
//       "course_id": "INTEGER",
//       "full_marks": "INTEGER"
//     },
//     "course_archived_users": {
//       "course_id": "INTEGER",
//       "archived_user_id": "INTEGER"
//     },
//     "courses": {
//       "id": "INTEGER",
//       "course_name": "VARCHAR(255)",
//       "instructor_id": "INTEGER",
//       "code": "VARCHAR(255)",
//       "meeting_link": "VARCHAR(255)",
//       "cover_photo": "VARCHAR(255)"
//     },
//     "doubt": {
//       "id": "INTEGER",
//       "content": "VARCHAR(255)",
//       "course_id": "INTEGER",
//       "user_id": "INTEGER"
//     },
//     "enrolled_users_courses": {
//       "course_id": "INTEGER",
//       "user_id": "INTEGER"
//     },
//     "files": {
//       "id": "INTEGER",
//       "file_name": "VARCHAR(255)",
//       "file_path": "VARCHAR(255)",
//       "submission_id": "INTEGER",
//       "assignment_id": "INTEGER",
//       "announcement_id": "INTEGER"
//     },
//     "form": {
//       "id": "INTEGER"
//     },
//     "form_item": {
//       "id": "INTEGER",
//       "question": "VARCHAR(255)",
//       "answer": "VARCHAR(255)",
//       "options": "VARBINARY(255)"
//     },
//     "message": {
//       "id": "INTEGER",
//       "chat_id": "INTEGER",
//       "sender_id": "INTEGER",
//       "content": "VARCHAR(10000)",
//       "course_id": "INTEGER",
//       "type": "VARCHAR(255)",
//       "doubt_id": "INTEGER"
//     },
//     "private_chat": {
//       "id": "INTEGER",
//       "assignment_id": "INTEGER",
//       "user_id": "INTEGER"
//     },
//     "submissions": {
//       "id": "INTEGER",
//       "late_status": "BIT(1)",
//       "submission_date_time": "DATETIME(6)",
//       "assignment_id": "INTEGER",
//       "user_id": "INTEGER",
//       "marks": "INTEGER",
//       "comment": "VARCHAR(255)"
//     },
//     "users": {
//       "id": "INTEGER",
//       "email": "VARCHAR(255)",
//       "first_name": "VARCHAR(255)",
//       "last_name": "VARCHAR(255)",
//       "password": "VARCHAR(255)",
//       "role": "ENUM(\"INSTRUCTOR\",\"STUDENT\")",
//       "reset_password_token": "VARCHAR(255)",
//       "reset_password_token_expires": "DATETIME(6)"
//     }
//   }```

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/fetch-table', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            User: "root",
            Password: "rootMySQL",
            Host: "localhost",
            Port: "3306",
            Database: "classroom",
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        // Remove backslashes and correct double quotes
        let jStr = result.tables_info;
        let str = '';
        for (let i = 0; i < jStr.length; i++) {
          if (jStr[i] !== '\\') {
            str += jStr[i];
          }
        }

        // Correcting the double quotes issue in ENUM values
        str = str.replace(/""/g, '\\"');

        // Parsing cleaned string to object
        let tablesInfo = JSON.parse(str);
        console.log(tablesInfo)

        setData(tablesInfo);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Data fetched from API:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Page;
