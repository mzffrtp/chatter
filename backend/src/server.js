import dotenv from "dotenv";
import express from "express";
import uWS from "uWebSockets.js";
import morgan from "morgan";
import mongoose from "mongoose";
import User from "./models/userModel.js";
import HttpServer from "./services/http-server-service.js";


dotenv.config({
    path: process.cwd() + "/.env"
})

export const bufferToString = (buffer, encoding = "ascii") => {
    return Buffer.from(buffer).toString(encoding)
};


(async () => {
    try {

        const mongoConnection = await mongoose.connect(process.env.MONGODB_CONNECTION)
        console.log("MongoDB connected");

        const httpServerService = new HttpServer();
        await httpServerService.start();
        httpServerService.use(morgan("dev"))
        httpServerService.use((req, res, next) => {
            req.reqtime = new Date().toDateString();
            next();
        })

        const websockerServer = uWS.App()

        websockerServer
            .ws("/*", {
                compression: uWS.SHARED_COMPRESSOR,
                maxPayloadLength: 16 * 1024 * 1024,
                idleTimeout: 10,
                open: (ws) => {
                    console.log(
                        "WebSocket connection received, IP: " + bufferToString(ws.getRemoteAddressAsText()));
                },
                message: (ws, message, isBinary) => {
                    console.log("WS message received, IP: " + bufferToString(ws.getRemoteAddressAsText(), "utf-8"), bufferToString(message));
                    let ok = ws.send(JSON.stringify({
                        status: "success",
                        data: "This data sent from server.",
                    }), false)
                },
                drain: (ws) => {
                    console.log("WebSocket backpressure: " + bufferToString(ws.getBufferedAmount()));
                },
                close: (ws, code, message) => {
                    console.log(
                        "WebSocket connection closed ");
                },
            })
            .any("/*", (res, req) => {
                res.end("HTTP Server response!");
            })
            .listen(process.env.WEBSOCKET_SERVER_HOST, process.env.WEBSOCKET_SERVER_PORT, (token) => {
                if (token) {
                    console.log(`Websocker Server started at --> ws://${process.env.WEBSOCKET_SERVER_HOST}:${process.env.WEBSOCKET_SERVER_PORT}`);
                } else {
                    console.log(`Failed to listen Websocker Server started at --> ws://${process.env.WEBSOCKET_SERVER_HOST}:${process.env.WEBSOCKET_SERVER_PORT}`);
                }
            })

    } catch (err) {
        console.log(); ("An error occured -->", err)
    }
})()








