import dotenv from "dotenv";
import express from "express";

dotenv.config({
    path: process.cwd() + "/.env"
})

//? HTTP SERVER

const httpServer = express();
httpServer.use("/", (req, res, next) => {
    res.status(200).json({
        foo: "foo",
        bar: "bar"
    })
})

httpServer.listen(parseInt(
    process.env.HTTP_SERVER_PORT),
    process.env.HTTP_SERVER_HOST,
    () => {
        console.log(`HTTP Server started at http://${process.env.HTTP_SERVER_HOST}: ${process.env.HTTP_SERVER_PORT}`);
    })
