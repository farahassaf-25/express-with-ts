import mongoose from "mongoose";
import { config } from 'dotenv'

config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/express-ts";

export const connectToDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        throw error;
    }
}

//handle mongodb connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

//close mongoose connection when node process ends
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});