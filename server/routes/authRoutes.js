import authController from "../controllers/authController.js";
import Routes from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
const router = new Routes();


router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post("logout",authController.logout);
router.put("/update-profile",authMiddleware,authController.updateProfile);
router.get("/check",authMiddleware,authController.checkAuth);

export default router;
