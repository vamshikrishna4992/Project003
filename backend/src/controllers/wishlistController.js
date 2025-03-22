import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { createError } from '../utils/error.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price image countInStock'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      status: 'success',
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Check if product already in wishlist
    if (wishlist.products.includes(productId)) {
      return next(createError(400, 'Product already in wishlist'));
    }

    // Add product
    wishlist.products.push(productId);
    await wishlist.save();

    // Populate product details
    const populatedWishlist = await wishlist.populate({
      path: 'products',
      select: 'name price image countInStock'
    });

    res.status(200).json({
      status: 'success',
      data: populatedWishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return next(createError(404, 'Wishlist not found'));
    }

    // Remove product
    wishlist.products = wishlist.products.filter(
      (productId) => productId.toString() !== req.params.productId
    );
    await wishlist.save();

    // Populate product details
    const populatedWishlist = await wishlist.populate({
      path: 'products',
      select: 'name price image countInStock'
    });

    res.status(200).json({
      status: 'success',
      data: populatedWishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
export const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return next(createError(404, 'Wishlist not found'));
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      status: 'success',
      data: []
    });
  } catch (error) {
    next(error);
  }
}; 