import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
const dbName = process.env.DB_NAME || "wedplan"

// Shared MongoClient instance for Better Auth & database operations
export const client = new MongoClient(uri)
export const db = client.db(dbName)
