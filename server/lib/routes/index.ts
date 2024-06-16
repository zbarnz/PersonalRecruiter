import express from "express";
import { authenticate } from "../middleware/authentication";
import { router as autoApplyRoute } from "./autoApply";
import { router as exceptionRoute } from "./exception";
import { router as gptLogRoute } from "./gptLog";
import { router as healthRoute } from "./health";
import { router as jobBoardRoute } from "./jobBoard";
import { router as listingRoute } from "./listing";
import { router as userRoute } from "./user";

const router = express.Router();

router.use("/user", userRoute);
router.use("/listing", authenticate, listingRoute);
router.use("/autoApply", authenticate, autoApplyRoute);
router.use("/gptLog", authenticate, gptLogRoute);
router.use("/exception", authenticate, exceptionRoute);
router.use("/jobBoard", authenticate, jobBoardRoute);
router.use("/health", healthRoute);

export default router;
