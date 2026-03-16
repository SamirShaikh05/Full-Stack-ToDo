import { MongoClient } from "mongodb";
import dotenv from 'dotenv'

dotenv.config();

const url = process.env.MONGO_URI;
const dbName = "To-Do-DB";
export const collectionName = "todo";
const client = new MongoClient(url);
export const connection = async()=>{
    const connect =  await client.connect();
    return connect.db(dbName);
}