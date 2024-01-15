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

    async startHeartBeat() {
        this.clients = this.clients.filter((item) => item)

        console.log(("sending HB data to these clients:" + this.clients.length + " " + Date.now()));


        this.clients.forEach((ws, index) => {

            try {
                console.log("🚀 ~ WebsocketServer ~ ws client remote adress", bufferToString(ws.getRemoteAddressAsText()))

                if (ws.lasthbTime < (Date.now() - 60)) {
                    delete this.clients[index]
                } else {
                    ws.send(JSON.stringify({ hb: Date.now() }))
                }
            } catch (e) {
                delete this.clients[index]
            }
        })
        setTimeout(() => this.startHeartBeat(), 5_000)
    }
    async start() {
        console.log("Websocket server startting");

        this.server = uWS.App()
        this.startHeartBeat();

        this.server
            .ws("/*", {
                compression: uWS.SHARED_COMPRESSOR,
                maxPayloadLength: 16 * 1024 * 1024,
                idleTimeout: 10,
                open: (ws) => {
                    try {
                        console.log(
                            "WebSocket connection received, IP: " + bufferToString(ws.getRemoteAddressAsText()));
                        ws.subscribe("default");
                        ws.send(
                            JSON.stringify({
                                status: "success",
                                data: "default odasina baglandiniz"
                            })
                        );

                        this.clients.push(ws)
                    } catch (e) {
                        console.log("🚀 ~ WebsocketServer ~ start ~ e:", e)
                    }
                },
                message: (ws, message, isBinary) => {
                    console.log(
                        "WS message received, IP: " +
                        bufferToString(ws.getRemoteAddressAsText()),
                        bufferToString(message, "utf-8"));

                    //!message from fontend websocket
                    let messageStr = bufferToString(message, "utf-8");
                    let messageObj = JSON.parse(messageStr)
                    console.log("🚀 ~ WebsocketServer ~ start ~ messageObj:", messageObj)

                    if (message.command === "auth_login") {
                        const websocketFoundUserId = this.services.cache.getSync(
                            "auth_" + messageObj.token
                        )

                        //!
                        console.log("🚀 ~ WebsocketServer ~ start ~ websocketFoundUserId:", websocketFoundUserId)
                        console.log(">>messageObj.token-->", messageObj.token);
                        //!

                        if (websocketFoundUserId) {
                            ws.getUserData().userId = websocketFoundUserId;

                            ws.send(JSON.stringify({
                                status: "success",
                                data: "Successfully loged in!"
                            }))
                        } else {

                            ws.send(
                                JSON.stringify({
                                    status: "error",
                                    data: "Invalid token, connection lost!!"
                                }));

                            setTimeout(() => {
                                ws.close();
                            }, 2_000);

                        }
                    }
                    else if (message.command === "auth_logout") { }
                    else if (message.command === "room_send") { }
                    else if (message.command === "room_join") { }


                    {/*
                    let ok = ws.send(JSON.stringify({
                        status: "success",
                        data: "This data sent from server.",
                    }), false)
                
                */}
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

                //todo move from clients list
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