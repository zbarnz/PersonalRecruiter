import express from "express";
import applicationController from "../../src/controllers/application";

export const router = express.Router();

router.post("/get", applicationController.getApplications);
