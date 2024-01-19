import uWS from "uWebSockets.js";
import { bufferToString, findAllControllerFiles } from "../../utils.js";

export default class WebsocketServer {
    services = null;
    wsServer = null;

    wsClients = [];
    //TODO which client in which room
    wsRoomSubscripter = []
    wsRoutes = {};

    constructor(services) {
        this.services = services
        console.log("Websocket server instance created");
    }
    async getRoomOnlinePeers(roomId) {
        //TODO FIX HERE
        return []
    }
    async sendData(topic, message) {
        if (this.wsServer === null) {
            console.log("senddata --> error");
            return false
        }
        message = typeof message === "string" ? message : JSON.stringify(message)
        this.wsServer.publish(topic, message, false, false)
        return true
    }

    async startHeartBeat() {
        this.wsClients = this.wsClients.filter((item) => item)

        //console.log(("sending HB data to these clients:" + this.wsClients.length + " " + Date.now()));

        this.wsClients.forEach((ws, index) => {
            try {
                //console.log(">> WS client processing-->", ws.getUserData());

                // console.log("🚀 ~ WebsocketServer ~ ws client remote adress", bufferToString(ws.getRemoteAddressAsText()))

                if (ws.lasthbTime < (Date.now() - 60)) {
                    delete this.wsClients[index]
                } else {
                    ws.send(JSON.stringify({ hb: Date.now() }))
                }
            } catch (e) {
                delete this.wsClients[index]
            }
        })
        setTimeout(() => this.startHeartBeat(), 10_000)
    }

    async configureWebsocketRoutes() {
        const controllerFiles = findAllControllerFiles();

        for (let i = 0; i < controllerFiles.length; i++) {
            const controllerFile = controllerFiles[i];
            const controllerClass = await import(controllerFile)

            try {
                const obj = new controllerClass.default(this.services);
                await obj.registerWebsocketRoutes(this.wsRoutes);

            } catch (e) {
                //console.log("this file excluding:", controllerFile);
            }
        }
        console.log("All websocket routes: ", this.wsRoutes);
    }
    async start() {
        console.log("Websocket server startting");

        this.wsServer = uWS.App()
        await this.configureWebsocketRoutes();

        this.startHeartBeat();

        this.wsServer
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
                        //todo 
                        // ws.setUserData({ someKey: 'someValue' });

                        this.wsClients.push(ws)
                    } catch (e) {
                        console.log("🚀 ~ WebsocketServer ~ start ~ e:", e)
                    }
                },
                message: (ws, message, isBinary) => {
                    // console.log(
                    //    "WS message received, IP: " +
                    //    bufferToString(ws.getRemoteAddressAsText()),
                    //   bufferToString(message, "utf-8"));

                    //!message from fontend websocket
                    let messageStr = bufferToString(message, "utf-8");
                    let messageObj = JSON.parse(messageStr)
                    console.log(">> 🚀 messageObj:", messageObj);


                    const wsRouteList = Object.keys(this.wsRoutes);
                    const wsRouteMethods = Object.values(this.wsRoutes)

                    let commandFound = false;

                    wsRouteList.forEach((item, index) => {
                        if (item === messageObj.command) {
                            commandFound = true;

                            wsRouteMethods[index](ws, messageObj, this.wsServer)
                        }
                    })
                    if (!commandFound) {
                        ws.send(
                            JSON.stringify({
                                status: "error",
                                errorMessage: "Wrong ws command send from wscontext in frontend!"
                            })
                        )
                    }



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