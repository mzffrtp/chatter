import express from "express";
import fs from "fs";
import cors from "cors";
import { findAllControllerFiles } from "../../utils.js";

export default class HttpServer {
    httpServer = null
    services = null

    constructor(services) {
        console.log("Http server instance created");
        this.services = services;

        this.httpServer = express();
        this.httpServer.use(express.json())

        const corsOptions = {
            origin: ['http://localhost:5173', "http://127.0.0.1:5000", "http://127.0.0.1:5001"], // Allow requests from any origin
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        };
        this.httpServer.use(cors(corsOptions))

        this.httpServer.use(this.checkAuth.bind(this))

        //todo
        // this.httpServer.user(this.errorHandler.bind(this));
    };

    errorHandler(err, req, res, next) {
        try {
            next()
        } catch (e) {
            console.log("exception captured in middleware", e.message)

            res.json({
                status: "error",
                errorMessage: e.message
            })
        }
    }

    checkAuth(req, res, next) {
        if (
            req.originalUrl.startsWith("/auth") ||
            req.originalUrl.startsWith("/public")
        ) {
            next();
            return;
        }
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.json({
                status: "error",
                errorMessage: "No token!",
            });
            return;
        }
        const foundUserId = this.services.cache.getSync("auth_" + token);
        console.log("🚀 ~ HttpServer ~ checkAuth ~ foundUserId:", foundUserId)

        if (!foundUserId) {
            res.json({
                status: "error",
                errorMessage: "Invalid token!",
            });
            return
        }
        req.authUserId = foundUserId

        next();
    };

    async configureHttpServer() {

        const controllerFiles = findAllControllerFiles();
        //console.log("controllers-->", controllerFiles);

        for (let i = 0; i < controllerFiles.length; i++) {
            const controllerFile = controllerFiles[i];

            const controllerClass = await import(controllerFile)
            //console.log("<----------------------------------->");
            //console.log("controller-->", controllerFile);
            //console.log("val-->", controllerClass.default);
            //console.log("<----------------------------------->");

            try {
                const obj = new controllerClass.default(this.services);
                await obj.registerHttpRoutes(this.httpServer);

            } catch (e) {
                //console.log("this file excluding:", controllerFile);

            }
        }
    };

    async start() {
        console.log("Http server startting");

        await this.configureHttpServer();

        this.httpServer.listen(
            parseInt(process.env.HTTP_SERVER_PORT),
            process.env.HTTP_SERVER_HOST,
            () => {
                console.log(
                    `HTTP Server started at --> http://${process.env.HTTP_SERVER_HOST}:${process.env.HTTP_SERVER_PORT}`);
            })
    }
}