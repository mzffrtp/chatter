import { User } from "../../models/userModel.js";
import BaseController from "../base-controller.js";
import bcrypt from "bcrypt";
import crypto from "crypto";  // Import the crypto module

export default class AuthController extends BaseController {
    httpRoutes = {
        "/auth/login": (req, res) => this.login(req, res),
        "/auth/register": (req, res) => this.register(req, res),
    };

    websocketRoutes = {
        "auth_login": (req, res) => this.wsLoginHandler(req, res),
    }

    async wsLoginHandler(ws, incomingWsData, wsServer) {
        //console.log(">>>> wsloginhandler invoked", arguments);

        const websocketFoundUserId = this.services.cache.getSync(
            "auth_" + incomingWsData.token
        )
        // console.log("🚀 ~ AuthController ~ wsLoginHandler ~ websocketFoundUserId:", websocketFoundUserId)

        if (websocketFoundUserId) {
            ws.getUserData().userId = websocketFoundUserId;

            ws.send(JSON.stringify({
                status: "success",
                data: "Successfully loged in!",
                loginDate: Date.now()
            }));
        } else {

            ws.send(
                JSON.stringify({
                    status: "error",
                    data: "Invalid token, connection being closed!"
                }));

            setTimeout(() => {
                try {
                    if (ws.readyState === ws.OPEN) {
                        ws.close();
                    }
                } catch (error) {
                    console.error("Error closing WebSocket:", error);
                }
            }, 20_000);
        }
    };

    async login(req, res) {
        console.log(">>> Auth controller::login() function invoked.");

        let token = null;

        if (!req.body.username || req.body.username.length < 3) {
            return this.showError(res, "Please provide username");
        }

        if (!req.body.password || req.body.password.length < 6) {
            return this.showError(res, "Please provide a password with a minimum of 6 characters.");
        }

        const foundUser = await User.findOne({
            username: req.body.username,
        });

        if (!foundUser || !bcrypt.compareSync(req.body.password + process.env.APP_KEY, foundUser.password)) {
            return this.showError(res, "User not found, please check your credentials!");
        }

        if (process.env.AUTH_MECHANISM === "token") {
            // Create a hash, send to client, and keep it in the cache
            token = crypto.randomUUID();
            console.log("🚀 ~ AuthController ~ login ~ token:-->", token);

            this.services.cache.setSync("auth_" + token, foundUser._id, 60 * 60 * 5);

        } else if (process.env.AUTH_MECHANISM === "jwt") {
            // todo handle here,
            // todo token = jwt.sign();
        } else {
            // error management
        }

        return this.showSuccess(res, {
            token,
            user: {
                username: foundUser.username,
                email: foundUser.email,
                firstname: foundUser.firstname,
                lastname: foundUser.lastname,
                gender: foundUser.gender,
            }
        });
    }

    register(req, res) {
        console.log(">>> Auth controller::register() function invoked.");
        if (!req.body.username || req.body.username.length < 3) {
            return this.showError(res, "Please provide username");
        }

        if (!req.body.password || req.body.password.length < 6) {
            return this.showError(res, "Please provide a password with a minimum of 6 characters.");
        }

        if (!req.body.email || req.body.email.length < 6) {
            return this.showError(res, "Please provide an email with a minimum of 6 characters.");
        }

        (async () => {
            const hashedPassword = await bcrypt.hash(req.body.password + process.env.APP_KEY, 12);
            const newUser = await User.create({
                ...req.body,
                password: hashedPassword
            });

            console.log("new User", newUser);

            // TODO create JWT token and send to client

            return this.showSuccess(res, {
                username: newUser.username,
            });
        })();
    }
}
