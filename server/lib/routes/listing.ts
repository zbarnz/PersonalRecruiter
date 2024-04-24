import express from "express";
import listingController from "../../controllers/listing";

export const router = express.Router();

router.post("/create", listingController.saveListing);

router.get("/:_id", listingController.getListing);
