import BaseController from "./base-controller.js";

export default class RoomController extends BaseController {

    routes = {
        "/room/join": this.joinRoom.bind(this),
        "/room/create": this.createRoom.bind(this),
        "/room/sendMessage": this.sendMessage.bind(this),
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