import Room from "../models/Room.js";
import User from "../models/User.js";
class roomController{
    async createRoom(req,res){
        try{
            const {roomName,adminId} = req.body;
            
            if(!roomName || !adminId){
                res.status(400).json({message:"Room name and adminId are required"});
            }
            const candidate = await Room.create({roomName,adminId});
            res.status(200).json(candidate);
            if(req.app.get("socketIO")){
                const io = req.app.get("socketIO");
                io.emit("roomCreated",candidate);
            }
            
        }catch(e){
            console.log(e);
            res.status(500).json({message:"Failed to create room"});
        }
    }
    async getRooms(req,res){
        try{
            const rooms = await Room.find();
            res.status(200).json(rooms);
        }catch(e){
            console.log(e);
            res.status(500).json({message:"Failed to get rooms"});
        }

    }
    async addMember(req,res){
        try{
            const {roomId,userId} = req.body;
            if(!roomId || !userId){
                res.status(400).json({message:"RoomId and userId are required"});

            }
            const candidate = await Room.findOne({roomId});

            if(!candidate){
                res.status(400).json({message:"Room is not found"});
            }
            const user = await User.findOne({userId});

            if(!user){
                res.status(400).json({message:"User is not found"});
            }
            candidate.members.push(user);
            await candidate.save();
            res.status(200).json({message:"Member addedd successfully",candidate});
            
            if(req.app.get("socketIO")){
                const io = req.app.get("socketIO");
                io.to(roomId).emit("memberAdded",candidate);
            }

        }catch(e){
            console.log(e);
            res.status(500).json({message:"Failed to add member"});
        }
    }
    async removeMember(req,res){
        try{
             const{roomId,userId} = req.body;
            if(!roomId || !userId){
                    res.status(400).json({message:"RoomId and userId are required"});

            }
            const candidate = await Room.findOne({roomId});
            if(!candidate){
                res.status(400).json({message:"Room is not found"});
            }
            const user = await User.findOne({userId});
            if(!user){
                res.status(400).json({message:"User is not found"});
            }
            candidate.members.pull(user);
            await candidate.save();
            res.status(200).json({message:"Member removed successfully",candidate});
            if(req.app.get("socketIO")){
                const io = req.app.get("socketIO");
                io.to(roomId).emit("memberRemoved",candidate);
            }

        }catch(e){
            console.log(e);
            res.status(500).json({message:"Failed to remove member"});
        }
       
        
    }
    async deleteRoom(req,res){
        try{
            const{roomId} = req.body;
            if(!roomId){
                    res.status(400).json({message:"RoomId is required"});
            }
            const candidate = await Room.findOne({roomId});
            if(!candidate){
                res.status(400).json({message:"Room is not found"});
            }
            await candidate.remove();
            res.status(200).json({message:"Room was deleted"});
            if(req.app.get("socketIO")){
                const io = req.app.get("socketIO");
                io.emit("roomDeleted",candidate);
            }
        }catch(e){
            console.log(e);
            res.status(500).json({message:"Failed to delete room"});
        }
    }
}


export default new roomController();

