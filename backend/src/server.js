import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import HttpServer from "./services/server/http-server-service.js";
import WebsocketServer from "./services/server/websocket-server-service.js";
import NodeCache from "node-cache";


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
            websocketService: null,
            cache: new NodeCache(),
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









