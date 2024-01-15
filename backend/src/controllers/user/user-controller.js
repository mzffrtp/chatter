import { User } from "../../models/userModel.js";
import BaseController from "../base-controller.js";
import bcrypt from "bcrypt";


export default class UserController extends BaseController {
    httpRoutes = {
        "/user/me": (req, res) => this.me(req, res),
        "/user/logout": (req, res) => this.logout(req, res)
    };

    async me(req, res) {
        console.log(">>> User controller::me()function invoked.");
        console.log(">>> authuser id---> " + req.authUserId);


        const foundUser = await User.findOne({
            _id: req.authUserId
        })

        return this.showSuccess(res, {
            user: {
                username: foundUser.username,
                email: foundUser.email,
                firstname: foundUser.firstname,
                lastname: foundUser.lastname,
                gender: foundUser.gender,
            }
        });
    };

    logout(req, res) {
        console.log(">> Incoming auth header:", req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];

        if (typeof token === "undefined") {
            return this.showError(res, "No token!");
        }
        const foundUserId = this.services.cache.getSync("auth_" + token);

        if (typeof foundUserId === "undefined") {
            return this.showError(res, "Invalid token!");
        }

        console.log(">>>  foundUserId:", foundUserId);

        this.services.cache.remove("auth_" + token);

        return this.showSuccess(res, null);
    }
}