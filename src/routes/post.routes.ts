import { Router } from "express";
import { app } from "../app";
import { authenticate } from "../middlewares/authMiddleware";
import { createPost, deletePost, updatePost } from "../controllers/post.controller";


const router = Router();

router.use(authenticate)

router.route("/:communityId/createPost").post(createPost)

router.route("/:communityId/:postId/update").put(updatePost)

router.route("/:communityId/:postId/delete").delete(deletePost)







export default router