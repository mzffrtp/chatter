import dotenv from "dotenv";
import express from "express";
import uWS from "uWebSockets.js";

dotenv.config({
    path: process.cwd() + "/.env"
})

export const bufferToString = (buffer, encoding = "ascii") => {
    return Buffer.from(buffer).toString(encoding)
};

const httpServer = express();
const websockerServer = uWS.App()

httpServer.use("/", (req, res, next) => {
    res.status(200).json({
        foo: "foo",
        bar: "bar"
    })
})

websockerServer
    .ws("/*", {
        compression: uWS.SHARED_COMPRESSOR,
        maxPayloadLength: 16 * 1024 * 1024,
        idleTimeout: 10,
        open: (ws) => {
            console.log(
                "WebSocket connection received, IP:" + bufferToString(ws.getRemoteAddressAsText()));
        },
        message: (ws, message, isBinary) => {
            console.log("WS message received, IP:" + bufferToString(ws.getRemoteAddressAsText(), "utf-8"), bufferToString(message));
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
                "WebSocket connection closed, IP:" + bufferToString(ws.getRemoteAddressAsText()));
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

httpServer.listen(parseInt(
    process.env.HTTP_SERVER_PORT),
    process.env.HTTP_SERVER_HOST,
    () => {
        console.log(`HTTP Server started at --> http://${process.env.HTTP_SERVER_HOST}:${process.env.HTTP_SERVER_PORT}`);
    })
