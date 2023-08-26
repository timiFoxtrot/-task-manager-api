import express from "express";
import { createTask, deleteTask, getSingleTaskByUser, getTasksByUser, updateTask } from "../controllers/tasksController";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();

/* GET users listing. */
router.post("/", authMiddleware, createTask)
router.get("/", authMiddleware, getTasksByUser)
router.get("/:taskId", authMiddleware, getSingleTaskByUser)
router.patch("/:taskId", authMiddleware, updateTask)
router.delete("/:taskId", authMiddleware, deleteTask)
export default router;
