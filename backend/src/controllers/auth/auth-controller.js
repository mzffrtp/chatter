import { User } from "../../models/userModel.js";
import BaseController from "../base-controller.js";
import bcrypt from "bcrypt";


export default class AuthController extends BaseController {
    routes = {
        "/auth/login": (req, res) => this.login(req, res),
        "/auth/register": (req, res) => this.register(req, res),
        "/auth/logout": (req, res) => this.logout(req, res),
    };

    async login(req, res) {
        console.log(">>> Auth controller::login()function invoked.");

        if (!req.body.username && req.body.username.length < 3) {
            return this.showError(res, "Please provide username")
        };

        if (!req.body.password && req.body.password.length < 6) {
            return this.showError(res, "Please provide password with min 6 characters.")
        };

        const foundUser = await User.findOne({
            username: req.body.username,
        })

        if (!bcrypt.compareSync(req.body.password + process.env.APP_KEY, foundUser.password)) {
            return this.showError(
                res,
                "User not found, please check your credentilas!")
        }

        console.log("auth possible-->", foundUser);

        req.body.username;
        req.body.password;
        let token = null;


        //todo fix me!
        if (process.env.AUTH_MECHANISM === "token") {
            //! create a hash--> send to client --> keep it in cashe
            const token = crypto.randomUUID();
            console.log("token-->", token);

            console.log(this.services.cache.set("auth_" + token, foundUser._id, 60 * 60 * 5))

            return this.showSuccess(res, {
                data: token
            });

        } else if (process.env.AUTH_MECHANISM === "jwt") {
            //todo handle here,
            //todo token = jwt.sign();
        } else {
            // error management
        }

    };

    register(req, res) {
        console.log(">>> Auth controller::register()function invoked.");
        if (!req.body.username && req.body.username.length < 3) {
            return this.showError(res, "Please provide username")
        };

        if (!req.body.password && req.body.password.length < 6) {
            return this.showError(res, "Please provide password with min 6 characters.")
        };

        if (!req.body.email && req.body.email.length < 6) {
            return this.showError(res, "Please provide password with min 6 characters.")
        };

        (async () => {
            const hashedPassword = await bcrypt.hash(
                req.body.password + process.env.APP_KEY, 12
            )
            const newUser = await User.create({
                ...req.body,
                password: hashedPassword
            })

            console.log("new User", newUser);

            //TODO create JWT token and send to client

            return this.showSuccess(res, {
                username: newUser.username,
            });
        })();
    };

    logout(req, res) {
        console.log(">> Incoming auth header:", req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];

        if (typeof token === "undefined") {
            return this.showError(res, "No token!");
        }
        const foundUserId = this.services.cache.get("auth_" + token);

        if (typeof foundUserId === "undefined") {
            return this.showError(res, "Invalid token!");
        }

        console.log(">>>  foundUserId:", foundUserId);

        this.services.cache.del("auth_" + token);

        return this.showSuccess(res, null);
    }
}