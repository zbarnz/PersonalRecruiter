import express from "express";
import autoApplyController from "../../src/controllers/autoApply";

export const router = express.Router();

router.post("/create", autoApplyController.createApply);
router.post(
  "/removeAppliedListings",
  autoApplyController.removeAppliedListings
);
router.post("/", autoApplyController.getApplysForUser);

router.get("/complete/:_id", autoApplyController.completeApply);
