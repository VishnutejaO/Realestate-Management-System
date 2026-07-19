import fs from "fs";
import path from "path";
import Property from "../models/Property.js";

// ======================
// Add Property
// ======================
export const addProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      propertyType,
      purpose,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      pincode,
      amenities,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !price ||
      !propertyType ||
      !purpose ||
      !area ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    // Uploaded Images
    const images = req.files
  ? req.files.map((file) => `/uploads/properties/${file.filename}`)
  : [];

    // Create Property
    const property = await Property.create({
      title,
      description,
      price,
      propertyType,
      purpose,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      pincode,
      amenities: amenities
        ? amenities.split(",").map((item) => item.trim())
        : [],
      images,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Property added successfully.",
      property,
    });
  } catch (error) {
    console.error("Add Property Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Get All Properties
// ======================
export const getAllProperties = async (req, res) => {
  try {
    const {
      search,
      city,
      propertyType,
      purpose,
      minPrice,
      maxPrice,
      bedrooms,
      status,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // Filter object
    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (city) filter.city = city;
    if (propertyType) filter.propertyType = propertyType;
    if (purpose) filter.purpose = purpose;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (status) filter.status = status;

    // Price Filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOptions = { createdAt: -1 };

    if (sort) {
      switch (sort) {
        case "price":
          sortOptions = { price: 1 };
          break;

        case "-price":
          sortOptions = { price: -1 };
          break;

        case "createdAt":
          sortOptions = { createdAt: 1 };
          break;

        case "-createdAt":
          sortOptions = { createdAt: -1 };
          break;

        default:
          sortOptions = { createdAt: -1 };
      }
    }

    // Pagination
    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    // Total count
    const totalProperties = await Property.countDocuments(filter);

    // Fetch properties
    const properties = await Property.find(filter)
      .populate("owner", "firstName lastName email phone")
      .sort(sortOptions)
      .skip(skip)
      .limit(pageLimit);

    return res.status(200).json({
      success: true,
      page: currentPage,
      limit: pageLimit,
      totalProperties,
      totalPages: Math.ceil(totalProperties / pageLimit),
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get Properties Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Get Property By ID
// ======================
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "firstName lastName email phone"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Update Property
// ======================
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    // Only owner can update
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this property.",
      });
    }

    // Update only provided fields
    Object.keys(req.body).forEach((key) => {
      if (key === "amenities") {
        property.amenities = req.body.amenities
          .split(",")
          .map((item) => item.trim());
      } else {
        property[key] = req.body[key];
      }
    });

    // Replace images only if new ones are uploaded
    if (req.files && req.files.length > 0) {
      property.images = req.files.map(
        (file) => `/uploads/properties/${file.filename}`
      );
    }

    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property updated successfully.",
      property,
    });
  } catch (error) {
    console.error("Update Property Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ======================
// Delete Property
// ======================
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    // Only owner can delete
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this property.",
      });
    }

    // Delete uploaded images
    if (property.images.length > 0) {
      property.images.forEach((image) => {
        const imagePath = path.join(process.cwd(),"src",image.replace(/^\/+/, ""));

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Image Delete Error:", err.message);
          }
        });
      });
    }

    await property.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Property Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
  owner: req.user._id,
})
  .populate("owner", "firstName lastName email phone")
  .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("My Properties Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};