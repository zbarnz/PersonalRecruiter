import express from "express";
import wheelController from "../../src/controllers/wheel";
import { authenticate } from "../middleware/authentication";

export const router = express.Router();

router.get("/", authenticate, wheelController.verify);
router.get("/spin", authenticate, wheelController.verify);
