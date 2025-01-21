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
        message:{
            type:String,
            required:true,
            trim:true
        },
        messageType:{
            type:String,
            enum:['text','image','file'],
            default:'text',

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



