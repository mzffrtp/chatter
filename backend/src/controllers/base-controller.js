
export default class BaseController {
    services = null
    routes = {};

    constructor(services) {
        this.services = services
    }

    registerRoutes(httpServer) {
        console.log("RoomController::registerRoutes () function invoked");


        const keys = Object.keys(this.routes)
        //console.log("keys", keys);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]

            console.log("Endpoints-->" + key);
            const method = this.routes[key]
            httpServer.use(key, (req, res) => method(req, res))
        }
    }
}