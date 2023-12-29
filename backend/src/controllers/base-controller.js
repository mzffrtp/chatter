
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

    checkAuth(req, res) {
        const token = req.headers.authorization.split(" ")[1];

        if (typeof token === "undefined") {
            this.showError(res, "No token!");
            return false
        }
        const foundUserId = this.services.cache.get("auth_" + token);

        if (typeof foundUserId === "undefined") {
            this.showError(res, "Invalid token!");
            return false;
        }
        return true;
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