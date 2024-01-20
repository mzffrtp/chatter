import { parse } from "stack-trace"

export default class BaseController {
    services = null
    httpRoutes = {};
    websocketRoutes = {};

    constructor(services) {
        this.services = services
    }

    showError(res, errorMessage) {
        res.json({
            status: "error",
            errorMessage
        })
    };

    showSuccess(res, data) {
        res.json({
            status: "success",
            data
        })
    };

    registerHttpRoutes(httpServer) {
        const keys = Object.keys(this.httpRoutes)
        //console.log("keys", keys);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]

            console.log(">> Http Endpoints-->" + key);
            const method = this.httpRoutes[key]
            httpServer.use(key, async (req, res) => {
                try {
                    await method(req, res)
                } catch (e) {
                    const parsedError = parse(e);

                    console.log("Error during registering routes",
                        e.message,
                        `${parsedError[0].getFileName()}:${parsedError[0].getLineNumber()}`);

                    res.json({
                        status: "error",
                        errorMessage: e.message
                    })
                }
            })
        }
    }

    registerWebsocketRoutes(routesObj) {
        const keys = Object.keys(this.websocketRoutes)
        //console.log("keys", keys);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            console.log(">> Ws Endpoints-->" + key);
            routesObj[key] = this.websocketRoutes[key]
        }
    }
}