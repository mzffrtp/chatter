import uWS from "uWebSockets.js";
import { bufferToString } from "../../utils.js";

export default class WebsocketServer {
    services = null;
    server = null;

    //! WHICH WS WHICH USER?
    clients = [];
    constructor(services) {
        this.services = services
        console.log("Websocket server instance created");
    }

    async sendData(topic, message) {
        if (this.server === null) {
            console.log("senddata --> error");
            return false
        }
        message = typeof message === "string" ? message : JSON.stringify(message)
        this.server.publish(topic, message, false, false)
        return true
    }

    async start() {
        console.log("Websocket server startting");

        this.server = uWS.App()

        this.server
            .ws("/*", {
                compression: uWS.SHARED_COMPRESSOR,
                maxPayloadLength: 16 * 1024 * 1024,
                idleTimeout: 10,
                open: (ws) => {
                    console.log(
                        "WebSocket connection received, IP: " + bufferToString(ws.getRemoteAddressAsText()));
                    ws.subscribe("default");
                    ws.send(
                        JSON.stringify({
                            status: "success",
                            data: "default odasina baglandiniz"
                        })
                    )
                },
                message: (ws, message, isBinary) => {
                    console.log(
                        "WS message received, IP: " +
                        bufferToString(ws.getRemoteAddressAsText()),
                        bufferToString(message, "utf-8"));

                    if (message.command === "auth/login") {
                        //todo handle here!
                    }
                    else if (message.command === "join_room") { }
                    else if (message.command === "join_room") { }

                    let ok = ws.send(JSON.stringify({
                        status: "success",
                        data: "This data sent from server.",
                    }), false)
                },
                drain: (ws) => {
                    console.log(
                        "WebSocket backpressure: " +
                        bufferToString(ws.getRemoteAddressAsText())
                    );
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

    }
}