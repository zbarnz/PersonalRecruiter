import express from "express";
import { router as gptLogRoute } from "./gptLog";
import { router as listingRoute } from "./listing";
import { router as userRoute } from "./user";
import { router as autoApplyRoute } from "./autoApply";

const router = express.Router();

router.use("/user", userRoute);
router.use("/listing", listingRoute);
router.use("/autoApply", autoApplyRoute);
router.use("/gptLog", gptLogRoute);

export default router;
