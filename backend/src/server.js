import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import HttpServer from "./services/server/http-server-service.js";
import WebsocketServer from "./services/server/websocket-server-service.js";
import { Cache } from "file-system-cache";


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
            cache: new Cache({
                basePath: "./.cache", // (optional) Path where cache files are stored (default).
                ns: "aaa",   // (optional) A grouping namespace for items.
                hash: "sha1",         // (optional) A hashing algorithm used within the cache key.
                ttl: 60 * 60 * 5              // (optional) A time-to-live (in secs) on how long an item remains cached.
            })
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









