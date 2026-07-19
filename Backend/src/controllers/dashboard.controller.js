import User from "../models/User.js";
import Property from "../models/Property.js";
import Wishlist from "../models/Wishlist.js";

// ======================
// Dashboard Statistics
// ======================
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      availableProperties,
      soldProperties,
      rentProperties,
      wishlistCount,
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ status: "Available" }),
      Property.countDocuments({ status: "Sold" }),
      Property.countDocuments({ purpose: "Rent" }),
      Wishlist.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProperties,
        availableProperties,
        soldProperties,
        rentProperties,
        wishlistCount,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Recent Properties
// ======================
export const getRecentProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "firstName lastName email phone")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Recent Properties Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Recent Users
// ======================
export const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken -__v")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Recent Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Recent Wishlist
// ======================
export const getRecentWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find()
      .populate("user", "firstName lastName email")
      .populate(
        "property",
        "title price city propertyType purpose status"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error("Recent Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};