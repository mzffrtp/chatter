import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import User from "./models/userModel.js";
import HttpServer from "./services/http-server-service.js";
import WebsocketServer from "./services/websocket-server-service.js";


dotenv.config({
    path: process.cwd() + "/.env"
})

export const bufferToString = (buffer, encoding = "ascii") => {
    return Buffer.from(buffer).toString(encoding)
};


(async () => {
    try {

        const services = {
            mongoConnection: null,
            httpServerService: null,
            websocketService: null
        };

        const mongoConnection = await mongoose.connect(process.env.MONGODB_CONNECTION)
        console.log("MongoDB connected");

        services.mongoConnection = mongoConnection;

        const httpServerService = new HttpServer(services);
        await httpServerService.start();
        services.httpServerService = httpServerService;

        const websocketService = new WebsocketServer(services);
        await websocketService.start();
        services.websocketService = websocketService;


    } catch (err) {
        console.log(); ("An error occured -->", err)
    }
})()








