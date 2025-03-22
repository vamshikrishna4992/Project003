import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { createError } from '../utils/error.js';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      status: 'delivered'
    });

    if (!hasPurchased) {
      return next(createError(400, 'You must purchase the product to review it'));
    }

    // Check if user has already reviewed
    const hasReviewed = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (hasReviewed) {
      return next(createError(400, 'You have already reviewed this product'));
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    res.status(201).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to update this review'));
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    res.status(200).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    // Check if user owns the review or is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return next(createError(403, 'Not authorized to delete this review'));
    }

    await review.deleteOne();

    // Update product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    product.numReviews = reviews.length;
    product.rating = reviews.length
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      : 0;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      'user',
      'name avatar'
    );

    if (!review) {
      return next(createError(404, 'Review not found'));
    }

    res.status(200).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    next(error);
  }
}; 