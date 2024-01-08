import { Room } from "../models/roomModel.js";
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

    async createRoom(req, res) {
        console.log("RoomController::createRoom () function invoked");

        const validResult = createRoomValidator.validate(req.body);
        if (validResult.error) {
            this.showError(res, validResult.error)
            return;
        }

        console.log(validResult, "RoomController::validResult-->");

        const newRoom = await Room.create({
            ...validResult.value,
            userId: req.authUserId
        })
        console.log("room controller, new room -->", newRoom);


        this.showSuccess(res, {
            status: "Room created succesfully",
            newRoom
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