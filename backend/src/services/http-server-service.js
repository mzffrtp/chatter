import express from "express";
import dotenv from "dotenv"



export default class HttpServer {
    httpServer;

    constructor() {
        console.log("Http server instance created");
        this.httpServer = express();

        //TODO configure http server with routes
    }

    configureHttpServer() {
        const controllers = findAllControllers()

        controllers.forEach((controller) => {
            this.httpServer.use()
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