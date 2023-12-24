import express from "express";
import fs from "fs";

export default class HttpServer {
    httpServer;

    constructor() {
        console.log("Http server instance created");
        this.httpServer = express();

        //TODO configure http server with routes

    };

    findAllControllerFiles() {
        const controllerFiles = [];
        const controllerFolder = process.cwd() + "/src/controllers"

        function findControllerFiles(currentDirectory) {
            fs.readdirSync(currentDirectory, { withFileTypes: true }).forEach(
                (currentFile) => {
                    console.log("Controlller file: ", currentFile);

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
        console.log("controllers -->", controllerFiles);

        for (let i = 0; i < controllerFiles.lenght; i++) {
            const controllerFile = controllerFiles[i]

            const controllerClass = await import(controllerFile)
            console.log("<----------------------------------->");
            console.log("Ctrl-->", controllerFile);
            console.log("Val-->", controllerClass.default);
            console.log("<----------------------------------->");
        }

    };

    async start() {
        console.log("Http server startting");
        this.configureHttpServer();


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