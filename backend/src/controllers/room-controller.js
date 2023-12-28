import BaseController from "./base-controller.js";

export default class RoomController extends BaseController {

    routes = {
        "/room/joinRoom": this.joinRoom.bind(this),
        "/room/createRoom": this.createRoom.bind(this),
        "/room/sendMessage": this.sendMessage.bind(this),
        "/room/deleteRoom": this.deleteRoom.bind(this),
        "/room/listRoom": this.listRoom.bind(this),

    };

    deleteRoom(req, res) {
        console.log("RoomController::deleteRoom () function invoked");
        res.json({
            status: "success"
        })
    };

    listRoom(req, res) {
        console.log("RoomController::listRoom () function invoked");
        res.json({
            status: "success"
        })
    };

    createRoom(req, res) {
        console.log("RoomController::createRoom () function invoked");
        res.json({
            status: "success"
        })
    };

    joinRoom(req, res) {
        console.log(">> RoomController::join() function invoked.");

        this.services.websocketService.sendData("default", {
            message: "Yeni bir kullanıcı odaya girdi.",
        });

        res.json({
            status: "success",
            datetime: Date.now().toLocaleString(),
        });
    };

    sendMessage(req, res) {
        console.log(">> RoomController::sendMessage() function invoked.");
        console.log("incoming form data, message --->", req.body);

        //TODO mesah to DB + send to other clients by websocket
        this.services.websocketService.sendData("default", {
            message: "Yeni bir kullanıcı odaya girdi.",
        });

        res.json({
            status: "success",
            datetime: Date.now().toLocaleString(),
        });
    }
}