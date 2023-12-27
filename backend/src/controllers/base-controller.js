
export default class BaseController {
    services = null
    routes = {};

    constructor(services) {
        this.services = services
    }

    registerRoutes(httpServer) {
        console.log("RoomController::registerRoutes () function invoked");

        const keys = Object.keys(this.routes)
        for (let i = 0; i < this.keys.length; i++) {
            const key = keys[i]
            const method = this.routes[key]
            httpServer.use(keys, (req, res) => method(req, res))
        }
    }
}