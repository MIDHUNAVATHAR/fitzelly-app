import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Server } from "http";

import app from "./app.js";

/* ===============================
    GLOBAL PROCESS ERROR HANDLERS
================================ */

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
})

/* ===============================
    APP INITIALIZATION
================================ */


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined");
    process.exit(1);
}

let server: Server;

// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log(`🌿 MongoDB Connected Successfully`);

        server = app.listen(PORT, () => {
            console.log(`🚀 Fitzelly Server running on port:${PORT}`)
        })
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    })




// Graceful shutdown for Unhandled Rejections
process.on("unhandledRejection", (reason: unknown) => {
    console.error("UNHANDLED REJECTION 💥 Shutting down...");

    //unhandledRejection takes the anything throw , not always Error -eg: throw something went wrong 
    if (reason instanceof Error) {
        console.error(reason.name, reason.message)
    } else {
        console.error("Unknown rejection:", reason)
    }

    if (server) {
        /* this allow existing request to finish */
        server.close(() => {
            process.exit(1);
        })
    } else {
        process.exit(1);
    }
})