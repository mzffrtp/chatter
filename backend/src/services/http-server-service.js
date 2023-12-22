import { log } from "console";
import express from "express";
import fs from "fs";

export default class HttpServer {
    httpServer;

    constructor() {
        console.log("Http server instance created");
        this.httpServer = express();

        //TODO configure http server with routes

    };

    findAllControllers() {
        const controllerFiles = [];
        const controllerFolder = process.cwd() + "/src/controller"

        function findControllerFiles(currentDirectory) {
            fs.readdirSync(currentDirectory, { withFileTypes: true }).forEach((currentFile) => {
                console.log("Controlller file: ", currentFile);

                if (currentFile.isDirectory()) {
                    findControllerFiles(currentDirectory + "/" + currentFile.name)
                    return
                }

                controllerFiles.push(currentDirectory + "/" + currentFile.name);
            })
        }
        findControllerFiles(controllerFolder)
        return controllerFiles
    };

    configureHttpServer() {
        const controllers = this.findAllControllers();
        console.log("controllers -->", controllers);

        controllers.forEach(async (controller) => {
            const controllerClass = await import(controller)
            console.log("Ctrl-->", controller);
            console.log("Val-->", controller, controllerClass);
            console.log("<----------------------------------->");


            //this.httpServer.use(generateUrlFromController(controller), controller)
        })
    };

    async start() {
        console.log("Http server startting");

        this.httpServer.use("/", (req, res, next) => {
            res.status(200).json({
                foo: "foo",
                bar: "bar"
            })
        });

        this.httpServer.listen(parseInt(
            process.env.HTTP_SERVER_PORT),
            process.env.HTTP_SERVER_HOST,
            () => {
                console.log(`HTTP Server started at --> http://${process.env.HTTP_SERVER_HOST}:${process.env.HTTP_SERVER_PORT}`);
            })
    }
}