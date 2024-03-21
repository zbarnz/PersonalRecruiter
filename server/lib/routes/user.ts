import express from "express";
import userController from "../../controllers/user";

export const router = express.Router();

router.post("/create", userController.createUser);
router.get("/:_id", userController.getUser);


