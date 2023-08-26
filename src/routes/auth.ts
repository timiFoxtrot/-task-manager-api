import express from "express";
import {
  getUSer,
  loginUser,
  registerUser,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();

/* GET home page. */
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, getUSer);

export default router;
