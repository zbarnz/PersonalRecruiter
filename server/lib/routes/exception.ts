import express from "express";
import exceptionController from "../../src/controllers/exception";

export const router = express.Router();

router.post("/create", exceptionController.createException);


