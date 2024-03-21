import express from "express";
import gptLogController from "../../controllers/gPTLog";

export const router = express.Router();

router.post("/create", gptLogController.createGPTLog);
router.get("/:_id", gptLogController.getGPTLog);
