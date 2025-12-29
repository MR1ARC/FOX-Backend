import { Router } from "express";
import { app } from "../app";
import { authenticate } from "../middlewares/authMiddleware";
import { createCommunity, deleteCommunity, updateCommunity } from "../controllers/community.controller";



const router = Router();

router.use(authenticate)

router.route("/create").post(createCommunity)

router.route("/:communityTitle/update").put(updateCommunity)

router.route("/:communityTitle/delete").delete(deleteCommunity)



export default router