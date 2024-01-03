import express from "express";
import fs from "fs";
import cors from "cors";

export default class HttpServer {
    httpServer = null
    services = null

    constructor(services) {
        console.log("Http server instance created");
        this.services = services;

        this.httpServer = express();
        this.httpServer.use(express.json())

        const corsOptions = {
            origin: '*', // Allow requests from any origin
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        };
        this.httpServer.use(cors(corsOptions))
    };

    checkAuth(req, res, next) {
        if (req.originalUrl.startsWith("/auth")) {
            next();
            return;
        }
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            next(this.showError(res, "No token!"));
            return
        }
        const foundUserId = this.services.cache.get("auth_" + token);
        console.log("foundUserId-->", foundUserId);

        if (!foundUserId) {
            next(this.showError(res, "Invalid token!"))
            return
        }
        req.authUserId = foundUserId
        next();
    };

    findAllControllerFiles() {
        const controllerFiles = [];
        const controllerFolder = process.cwd() + "/src/controllers"

        function findControllerFiles(currentDirectory) {
            fs.readdirSync(currentDirectory, { withFileTypes: true }).forEach(
                (currentFile) => {

                    if (currentFile.isDirectory()) {
                        findControllerFiles(currentDirectory + "/" + currentFile.name)
                        return;
                    }

                    controllerFiles.push(currentDirectory + "/" + currentFile.name);
                });
        }
        findControllerFiles(controllerFolder)
        return controllerFiles
    };

    async configureHttpServer() {

        const controllerFiles = this.findAllControllerFiles();
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
                await obj.registerRoutes(this.httpServer);

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