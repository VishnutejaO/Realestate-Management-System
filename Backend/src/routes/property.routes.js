import express from "express";

import {
  addProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from "../controllers/property.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getAllProperties);

router.get("/my-properties", verifyToken, getMyProperties);

router.get("/:id", getPropertyById);

router.post("/", verifyToken, upload.array("images", 5), addProperty);

router.put("/:id", verifyToken, upload.array("images", 5), updateProperty);

router.delete("/:id", verifyToken, deleteProperty);

export default router;