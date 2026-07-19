import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ======================
// Get All Users
// ======================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken -__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Get User By ID
// ======================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -refreshToken -__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Change User Role
// ======================
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["Admin", "Customer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be Admin or Customer.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.role = role;
await user.save();

const updatedUser = await User.findById(user._id).select(
  "-password -refreshToken -__v"
);

return res.status(200).json({
  success: true,
  message: "User role updated successfully.",
  user: updatedUser,
});
  } catch (error) {
    console.error("Change Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Create Customer
// ======================
export const createCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: "Customer",
    });

    const user = await User.findById(customer._id).select(
      "-password -refreshToken -__v"
    );

    return res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      user,
    });
  } catch (error) {
    console.error("Create Customer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};