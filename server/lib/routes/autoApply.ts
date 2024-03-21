import express from "express";
import autoApplyController from "../../controllers/autoApply";

export const router = express.Router();

router.post("/create", autoApplyController.createApply);
router.get("/:_id", autoApplyController.getApply);

