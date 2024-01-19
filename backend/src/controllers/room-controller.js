import { Room } from "../models/roomModel.js";
import createRoomValidator from "../request-validators/room/create-room-validator.js";
import BaseController from "./base-controller.js";

export default class RoomController extends BaseController {

    httpRoutes = {
        "/room/joinRoom": this.joinRoom.bind(this),
        "/room/createRoom": this.createRoom.bind(this),
        "/room/:id": (req, res) => this.getRoom(req, res),
        "/room/sendMessage": this.sendMessage.bind(this),
        "/room/deleteRoom": this.deleteRoom.bind(this),
        "/room/listRoom": this.listRoom.bind(this),
        "/public/room/lastRooms": (req, res) => this.lastRooms(req, res),
    };

    websocketRoutes = {
        "room_send": (req, res) => this.wsRoomSendHandler(req, res),
        "room_join": (req, res) => this.wsRoomJoinHandler(req, res),
        "room_exit": (req, res) => this.wsRoomExitHandler(req, res),


    }
    async wsRoomSendHandler(ws, incomingData, wsServer) {
        // TODO Handle here.
    };

    async wsRoomJoinHandler(ws, incomingData, wsServer) {
        // TODO Handle here.
    };

    async wsRoomExitHandler(ws, incomingData, wsServer) {
        // TODO Handle here.
    }

    async getRoom(req, res) {
        console.log("RoomController::getRoom () function invoked");

        let fetchedRoom = await Room.findById(req.params.id)
        fetchedRoom = fetchedRoom.toJSON();

        fetchedRoom.peers = this.services.websocketService.getRoomOnlinePeers(req.params.id)

        this.showSuccess(res, {
            fetchedRoom
        })


    };

    async deleteRoom(req, res) {
        //! NEVER DELETE ROOMS
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

        const room = await Room.create({
            ...validResult.value,
            userId: req.authUserId
        })
        console.log("room controller, new room -->", room);


        this.showSuccess(res, {
            status: "Room created succesfully",
            room
        })
    };

    async lastRooms(req, res) {
        try {
            console.log("RoomController::lastRoom () function invoked");

            const lastRooms = await Room.find().sort({ _id: -1 }).limit(6).exec()

            this.showSuccess(res, {
                status: "Lastrooms listed succesfully",
                lastRooms
            });
        } catch (e) {
            this.showError(res, {
                status: "error",
                e
            })
            console.log("error lastroom-->", e);
        }
    };
    joinRoom(req, res) {
        console.log(">> RoomController::join() function invoked.");

        this.showSuccess(res, {
            status: "joined room succesfully",

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