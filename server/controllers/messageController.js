import Message from "../models/Message.js";


class messageController{
    async sendMessage(req,res){
        try{
            const {senderId,receiverId,roomId,message,messageType} = req.body;

            const newMessage = await Message.create({
                senderId,receiverId,roomId,message,messageType
            });

            res.status(201).json({message:"Message sent successfully",data:newMessage});

            if(req.app.get("socketIO")){
                const io = req.app.get("socketIO");
                if(roomId){
                    io.to(roomId).emit("messageReceived",newMessage);
                }else{
                    io.to(receiverId).emit("messageReceived",newMessage);
                }
            }
        }catch(e){
            console.log(e);
            res.status(500).json({
                error:"Failed to send message"
            })
        }
        
    }
    async getMessagePrivate(req,res){
        try{
            const {senderId,receiverId} = req.body;
            const messages = await Message.find({
                $or:[
                    {senderId,receiverId},
                    {senderId:receiverId,receiverId:senderId}
                ]
            }
            ).sort({createdAt:1});
            res.status(201).json({
                messages
            })
        }catch(e){
            console.log(e);
            res.status(500).json({
                error:"Failed to send message"
            })
        }
    }
    async getMessageGroup(req,res){
        try{
            const {roomId} = red.body;

            const messages = await Message.find({roomId}).sort({createdAt:1});

            res.status(201).json({messages});
        }catch(e){
            console.log(e);
            res.status(500).json({
                error:"Failed to send message"
            })
        }
    }
    async searchMessage(req,res){
        try{
            const {keyword,roomId,senderId,receiverId,} = req.body;
            const query = {
                message: {$regex:keyword,$options:"i"}
            };
            if(roomId) query.roomId = roomId;
            if(senderId && receiverId){
                query.$or = [
                    {senderId,receiverId},
                    {senderId:receiverId,receiverId:senderId}
                ];
            }
            const messages = await Message.find(query).sort({createdAt:1});

             res.status(201).json({messages});
        } catch (e) {
            console.log(e);
            res.status(500).json({e})
        }
    }
}

export default new messageController();