import express from "express";
import exceptionController from "../../controllers/exception";

export const router = express.Router();

router.post("/create", exceptionController.createException);


