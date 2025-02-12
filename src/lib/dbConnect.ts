// Dependencies
import mongoose from "mongoose";

// Type imports
import { ConnectionObject } from "@/types/lib.types";

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        return console.log('Already connected to database.'); 
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        connection.isConnected = db.connections[0].readyState;

        console.log('Database connected successfully!');
    } catch (error: any) {
        console.error('Error connecting database : ', error?.message);
        process.exit(1);  // gracefully exiting 
    }   
}