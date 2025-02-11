import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:false,
        },
        roomId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Room',
            required:false
        },
        text:{
            type:String,

        },
        image:{
            type:String,

        },
        
        timestamp:{
            type:Date,
            default:Date.now,
        }


    },
    {
        timestamps:true
    }
);

const Message = mongoose.model('Message',messageSchema);
export default Message;



