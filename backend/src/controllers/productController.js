import Product from '../models/Product.js';
import { createError } from '../utils/error.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      category,
      brand,
      minPrice,
      maxPrice,
      search
    } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category', 'name')
      .populate('vendor', 'name');

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: {
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('vendor', 'name')
      .populate('ratings.user', 'name');

    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Vendor
export const createProduct = async (req, res, next) => {
  try {
    // Add vendor to req.body
    req.body.vendor = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Vendor
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // Check if user is vendor or admin
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to update this product'));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // Check if user is vendor or admin
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to delete this product'));
    }

    await product.remove();

    res.status(200).json({
      status: 'success',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // Check if user has already reviewed
    const alreadyReviewed = product.ratings.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return next(createError(400, 'Product already reviewed'));
    }

    // Add review
    product.ratings.push({
      user: req.user.id,
      rating,
      title,
      comment
    });

    await product.save();

    res.status(201).json({
      status: 'success',
      message: 'Review added'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .sort({ averageRating: -1 })
      .limit(5)
      .populate('category', 'name')
      .populate('vendor', 'name');

    res.status(200).json({
      status: 'success',
      data: {
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .populate('category', 'name')
      .populate('vendor', 'name');

    res.status(200).json({
      status: 'success',
      data: {
        products: relatedProducts
      }
    });
  } catch (error) {
    next(error);
  }
}; 