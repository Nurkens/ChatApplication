import Router from 'express';
import messageController from '../controllers/messageController.js';
import authUser from '../middleware/authMiddleware.js';
const routerMessage = new Router();

routerMessage.post('/send',authUser,messageController.sendMessage);
routerMessage.get('/private',authUser,messageController.getMessagePrivate);
routerMessage.get('/room',authUser,messageController.getMessageGroup);

export default routerMessage;
