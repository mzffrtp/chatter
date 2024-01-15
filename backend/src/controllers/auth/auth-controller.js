import { User } from "../../models/userModel.js";
import BaseController from "../base-controller.js";
import bcrypt from "bcrypt";


export default class AuthController extends BaseController {
    routes = {
        "/auth/login": (req, res) => this.login(req, res),
        "/auth/register": (req, res) => this.register(req, res),
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

        if (
            !foundUser
            || !bcrypt.compareSync(
                req.body.password + process.env.APP_KEY, foundUser.password)) {
            return this.showError(
                res,
                "User not found, please check your credentilas!")
        }

        req.body.username;
        req.body.password;
        let token = null;


        //todo fix me!
        if (process.env.AUTH_MECHANISM === "token") {
            //! create a hash--> send to client --> keep it in cashe
            const token = crypto.randomUUID();

            this.services.cache.setSync("auth_" + token, foundUser._id, 60 * 60 * 5)
        } else if (process.env.AUTH_MECHANISM === "jwt") {
            //todo handle here,
            //todo token = jwt.sign();
        } else {
            // error management
        }

        return this.showSuccess(res, {
            data: token,
            user: {
                username: foundUser.username,
                email: foundUser.email,
                firstname: foundUser.firstname,
                lastname: foundUser.lastname,
                gender: foundUser.gender,
            }
        });
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

}