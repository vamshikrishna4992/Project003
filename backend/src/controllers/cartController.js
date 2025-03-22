import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { createError } from '../utils/error.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price image countInStock'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Calculate total
    const total = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      status: 'success',
      data: {
        items: cart.items,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    // Check stock
    if (product.countInStock < quantity) {
      return next(createError(400, 'Not enough stock'));
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity if total doesn't exceed stock
      if (existingItem.quantity + quantity > product.countInStock) {
        return next(createError(400, 'Cannot exceed available stock'));
      }
      existingItem.quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate product details
    const populatedCart = await cart.populate({
      path: 'items.product',
      select: 'name price image countInStock'
    });

    // Calculate total
    const total = populatedCart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      status: 'success',
      data: {
        items: populatedCart.items,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/update/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(createError(404, 'Cart not found'));
    }

    // Find item
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return next(createError(404, 'Item not found in cart'));
    }

    // Check stock
    const product = await Product.findById(item.product);
    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    if (quantity > product.countInStock) {
      return next(createError(400, 'Not enough stock'));
    }

    // Update quantity
    item.quantity = quantity;
    await cart.save();

    // Populate product details
    const populatedCart = await cart.populate({
      path: 'items.product',
      select: 'name price image countInStock'
    });

    // Calculate total
    const total = populatedCart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      status: 'success',
      data: {
        items: populatedCart.items,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(createError(404, 'Cart not found'));
    }

    // Remove item
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );
    await cart.save();

    // Populate product details
    const populatedCart = await cart.populate({
      path: 'items.product',
      select: 'name price image countInStock'
    });

    // Calculate total
    const total = populatedCart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      status: 'success',
      data: {
        items: populatedCart.items,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(createError(404, 'Cart not found'));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      status: 'success',
      data: {
        items: [],
        total: 0
      }
    });
  } catch (error) {
    next(error);
  }
}; 