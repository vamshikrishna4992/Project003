import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { createError } from '../utils/error.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(createError(404, 'Category not found'));
    }

    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    const categoryExists = await Category.findOne({ name: name.toLowerCase() });
    if (categoryExists) {
      return next(createError(400, 'Category already exists'));
    }

    const category = await Category.create({
      name: name.toLowerCase(),
      description,
      image,
      slug: name.toLowerCase().replace(/ /g, '-')
    });

    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(createError(404, 'Category not found'));
    }

    if (name) {
      const categoryExists = await Category.findOne({
        name: name.toLowerCase(),
        _id: { $ne: category._id }
      });
      if (categoryExists) {
        return next(createError(400, 'Category name already exists'));
      }
      category.name = name.toLowerCase();
      category.slug = name.toLowerCase().replace(/ /g, '-');
    }

    category.description = description || category.description;
    category.image = image || category.image;

    const updatedCategory = await category.save();

    res.status(200).json({
      status: 'success',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(createError(404, 'Category not found'));
    }

    // Check if there are products in this category
    const productsCount = await Product.countDocuments({ category: category._id });
    if (productsCount > 0) {
      return next(
        createError(400, 'Cannot delete category with associated products')
      );
    }

    await category.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/categories/:id/products
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(createError(404, 'Category not found'));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category: category._id })
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await Product.countDocuments({ category: category._id });

    res.status(200).json({
      status: 'success',
      data: {
        products,
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    next(error);
  }
}; 