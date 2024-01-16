
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
            httpServer.use(key, (req, res) => method(req, res))
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