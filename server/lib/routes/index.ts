import express from "express";
import { authenticate } from "../middleware/authentication";
import { reqLog } from "../middleware/reqLogger";
import { router as autoApplyRoute } from "./autoApply";
import { router as exceptionRoute } from "./exception";
import { router as gptLogRoute } from "./gptLog";
import { router as healthRoute } from "./health";
import { router as jobBoardRoute } from "./jobBoard";
import { router as listingRoute } from "./listing";
import { router as userRoute } from "./user";

const router = express.Router();

router.use("/user", reqLog, userRoute);
router.use("/listing", reqLog, authenticate, listingRoute);
router.use("/autoApply", reqLog, authenticate, autoApplyRoute);
router.use("/gptLog", reqLog, authenticate, gptLogRoute);
router.use("/exception", reqLog, authenticate, exceptionRoute);
router.use("/jobBoard", reqLog, authenticate, jobBoardRoute);
router.use("/health", reqLog, healthRoute);

export default router;
