import roomController from "../controllers/roomController.js";
import Router from "express";
import authUser from "../middleware/authMiddleware.js";

const routerRoom = new Router();

routerRoom.post("/createRoom",authUser,roomController.createRoom);
routerRoom.get("/createRoom",authUser,roomController.getRooms);
routerRoom.post("/addMember",authUser,roomController.addMember);
routerRoom.delete("/removeMember",authUser,roomController.removeMember);
routerRoom.delete("/deleteRoom",authUser,roomController.deleteRoom);


export default routerRoom;