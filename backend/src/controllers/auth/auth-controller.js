import BaseController from "../base-controller.js";

export default class AuthController extends BaseController {

    routes = {
        "auth/login": this.login.bind(this),
        "auth/register": this.register.bind(this),
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