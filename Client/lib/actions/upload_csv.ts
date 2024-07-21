"use server"
import axios from "axios"
export default async function upload_file(file:any){
    try{
        const response = await axios.post("http://localhost:8000/upload_csv", { file: file }, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    catch(e){
        console.log(e);
        return "Error Occured!"

    }
}