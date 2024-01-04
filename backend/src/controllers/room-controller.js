import createRoomValidator from "../request-validators/room/create-room-validator.js";
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

        this.showSuccess(res, {
            status: "Room deleted succesfully",
            roomInfo: null
        })
    };

    listRoom(req, res) {
        console.log("RoomController::listRoom () function invoked");

        this.showSuccess(res, {
            status: "Room(s) listed succesfully",
            roomInfo: null
        })
    };

    createRoom(req, res) {
        console.log("RoomController::createRoom () function invoked");
        createRoomValidator.validate(req.body);

        this.showSuccess(res, {
            status: "Room created succesfully",
            roomInfo: null
        })
    };

    joinRoom(req, res) {
        console.log(">> RoomController::join() function invoked.");

        this.services.websocketService.sendData("default", {
            message: "Yeni bir kullanıcı odaya girdi.",
        });

        this.showSuccess(res, {
            status: "Joined room succesfully",
            roomInfo: null
        });
    };

    sendMessage(req, res) {
        console.log(">> RoomController::sendMessage() function invoked.");
        console.log("incoming form data, message --->", req.body);

        //TODO mesah to DB + send to other clients by websocket
        this.services.websocketService.sendData("default", {
            message: "Yeni bir kullanıcı odaya girdi.",
        });

        this.showSuccess(res, {
            status: "Message sent succesfully",
            message: null
        });
    }
}