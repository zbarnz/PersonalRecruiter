import express from "express";
import jobBoardController from "../../controllers/jobBoard";

export const router = express.Router();

router.get("/:name", jobBoardController.getJobBoardByName);
