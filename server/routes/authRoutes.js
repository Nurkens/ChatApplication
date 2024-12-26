import authController from "../controllers/authController";
import Routes from 'express';

const router = new Routes();


router.post('/registration',authController.registration);
router.post('/login',authController.login);



export default router;
