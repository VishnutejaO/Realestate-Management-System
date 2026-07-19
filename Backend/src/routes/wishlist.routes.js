import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {addToWishlist,getWishlist,removeFromWishlist,checkWishlist,} from "../controllers/wishlist.controller.js";

const router = express.Router();
router.get("/", verifyToken, getWishlist);
router.get("/check/:propertyId", verifyToken, checkWishlist);
router.post("/:propertyId", verifyToken, addToWishlist);
router.delete("/:propertyId", verifyToken, removeFromWishlist);
export default router;