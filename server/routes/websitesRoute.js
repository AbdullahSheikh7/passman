import express from "express";
import { deleteAuthController, deletePasswordController, getAllAuthsController, addAuthController, editOneAuthController } from "../controllers/websitesController.js";

const router = express.Router();

router.get("/", getAllAuthsController);

router.post('/', addAuthController);

router.put("/:id", editOneAuthController)

router.delete("/:id", deleteAuthController);

router.delete("/website/:id", deletePasswordController)

export default router
