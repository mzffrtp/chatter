import { User } from "../../models/userModel.js";
import BaseController from "../base-controller.js";
import bcrypt from "bcrypt";

export default class AuthController extends BaseController {

    routes = {
        "auth/login": this.login.bind(this),
        "auth/register": this.register.bind(this),
    }

    async login(req, res) {
        console.log(">>> Auth controller::login()function invoked.");

        if (!req.body.username && req.body.username.length < 3) {
            res.json({
                status: "error",
                errorMessage: "Please provide username"
            })
            return
        };

        if (!req.body.password && req.body.password.length < 6) {
            res.json({
                status: "error",
                errorMessage: "Please provide password"
            })
            return
        };

        const foundUser = await User.findOne({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password + process.env.APP_KEY)
        })

        if (foundUser === null) {
            res.json({
                status: error,
                errorMessage: "User not found! Please check your credentials."
            })
            return
        }


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