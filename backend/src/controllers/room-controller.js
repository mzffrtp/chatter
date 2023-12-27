export default class RoomController {
    services = null

    constructor(services) {
        this.services = services

    }
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
    }

    registerRoutes(httpServer) {
        console.log("RoomController::registerRoutes () function invoked");

        //send data
        httpServer.use("/room/joinRoom", (req, res) => this.joinRoom(req, res));
    }
}