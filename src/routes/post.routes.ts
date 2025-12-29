import { Router } from "express";
import { app } from "../app";
import { authenticate } from "../middlewares/authMiddleware";
import { createPost } from "../controllers/post.controller";


const router = Router();

router.use(authenticate)

router.route("/create").post(createPost)

export default router