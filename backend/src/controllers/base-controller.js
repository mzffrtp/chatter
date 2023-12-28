
export default class BaseController {
    services = null
    routes = {};

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
    registerRoutes(httpServer) {


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