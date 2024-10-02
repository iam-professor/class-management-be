import express from "express";
import { createActivity, getActivityById, getAllActivities, login, register} from "../controllers/teacherControllers";
import { user } from "../middlewares/auth";
const router = express.Router();

router.route("/").post(register)
router.route("/login").post(login)
router.route('/activity').post(user,createActivity).get(getAllActivities).get(user,getActivityById)
 
export default router;
