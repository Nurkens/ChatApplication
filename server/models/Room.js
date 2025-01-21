import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        roomName:{
            type:String,
            required:true,
            trim:true
        },
        adminId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        members:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            { timestamps:true}
        ]
    }
)
export default mongoose.model('Room',roomSchema);
