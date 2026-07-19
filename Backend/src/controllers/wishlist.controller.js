import Wishlist from "../models/Wishlist.js";
import Property from "../models/Property.js";

// ======================
// Add to Wishlist
// ======================
export const addToWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    console.log("User:", req.user);
    console.log("User ID:", userId);
    console.log("Property ID:", propertyId);

    const property = await Property.findById(propertyId);
    console.log("Property:", property);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    const exists = await Wishlist.findOne({
      user: userId,
      property: propertyId,
    });

    console.log("Existing Wishlist:", exists);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Property already in wishlist.",
      });
    }

    console.log("Creating wishlist...");

    const wishlist = await Wishlist.create({
      user: userId,
      property: propertyId,
    });

    console.log("Wishlist Created:", wishlist);

    return res.status(201).json({
      success: true,
      message: "Property added to wishlist.",
      wishlist,
    });
  } catch (error) {
    console.error("Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message, // 👈 temporarily return the real error
    });
  }
};

// ======================
// Get Wishlist
// ======================
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.find({ user: userId })
      .populate({
        path: "property",
        populate: {
          path: "owner",
          select: "firstName lastName email phone",
        },
      });

    return res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Remove from Wishlist
// ======================
export const removeFromWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOneAndDelete({
      user: userId,
      property: propertyId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Property not found in wishlist.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Property removed from wishlist.",
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Check Wishlist Status
// ======================
export const checkWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      user: userId,
      property: propertyId,
    });

    return res.status(200).json({
      success: true,
      isWishlisted: !!wishlist,
    });
  } catch (error) {
    console.error("Check Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};