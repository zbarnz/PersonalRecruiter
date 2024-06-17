import express from "express";
import userController from "../../src/controllers/user";
import { authenticate } from "../middleware/authentication";

export const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/refresh", authenticate, userController.refreshUser);
//router.get("/:_id", userController.getUser);
