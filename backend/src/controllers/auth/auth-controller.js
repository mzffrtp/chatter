export default class AuthController {
    registerRoutes(httpServer) {
        console.log(">>> Auth controller:: registerRoutes() function invoked.");

        httpServer.use("auth/login", this.login);
        httpServer.use("auth/register", this.register)
    }

    login(req, res) {
        console.log(">>> Auth controller::login()function invoked.");
        res.json({
            status: "success",
            method: "login"

        })
    };
    register(req, res) {
        console.log(">>> Auth controller::register()function invoked.");
        res.json({
            status: "success",
            method: "register"
        })
    };
}