import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { createError } from '../utils/error.js';
import { sendEmail } from '../utils/email.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return next(createError(400, 'No order items'));
    }

    // Check stock and update product quantities
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(createError(404, `Product not found: ${item.product}`));
      }
      if (product.countInStock < item.qty) {
        return next(createError(400, `${product.name} is out of stock`));
      }
      product.countInStock -= item.qty;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Send order confirmation email
    await sendEmail({
      email: req.user.email,
      subject: 'Order Confirmation',
      message: `Your order #${order._id} has been placed successfully. Total amount: $${totalPrice}`
    });

    res.status(201).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check if the user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return next(createError(403, 'Not authorized to view this order'));
    }

    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();

    // Send payment confirmation email
    await sendEmail({
      email: order.user.email,
      subject: 'Payment Confirmation',
      message: `Payment for order #${order._id} has been received. Thank you for your purchase!`
    });

    res.status(200).json({
      status: 'success',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();

    // Send delivery confirmation email
    await sendEmail({
      email: order.user.email,
      subject: 'Order Delivered',
      message: `Your order #${order._id} has been delivered. Thank you for shopping with us!`
    });

    res.status(200).json({
      status: 'success',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check if user is authorized to cancel this order
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return next(createError(403, 'Not authorized to cancel this order'));
    }

    // Check if order can be cancelled
    if (order.isDelivered) {
      return next(createError(400, 'Cannot cancel delivered order'));
    }

    // Restore product quantities
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.qty;
        await product.save();
      }
    }

    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    const updatedOrder = await order.save();

    // Send cancellation confirmation email
    await sendEmail({
      email: order.user.email,
      subject: 'Order Cancelled',
      message: `Your order #${order._id} has been cancelled. If you paid for this order, a refund will be processed.`
    });

    res.status(200).json({
      status: 'success',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request refund
// @route   PUT /api/orders/:id/refund
// @access  Private
export const requestRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check if user is authorized to request refund
    if (order.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Not authorized to request refund for this order'));
    }

    // Check if order is eligible for refund
    if (!order.isPaid) {
      return next(createError(400, 'Cannot request refund for unpaid order'));
    }

    if (order.refund.status === 'completed') {
      return next(createError(400, 'Refund already processed'));
    }

    order.refund = {
      status: 'pending',
      reason: req.body.reason,
      requestedAt: Date.now()
    };

    const updatedOrder = await order.save();

    // Send refund request confirmation email
    await sendEmail({
      email: order.user.email,
      subject: 'Refund Request Received',
      message: `Your refund request for order #${order._id} has been received and is being processed.`
    });

    res.status(200).json({
      status: 'success',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund
// @route   PUT /api/orders/:id/process-refund
// @access  Private/Admin
export const processRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check if refund is pending
    if (order.refund.status !== 'pending') {
      return next(createError(400, 'No pending refund request'));
    }

    // Process refund logic here (integrate with payment provider)
    order.refund.status = 'completed';
    order.refund.processedAt = Date.now();
    order.refund.processedBy = req.user._id;

    const updatedOrder = await order.save();

    // Send refund processed email
    await sendEmail({
      email: order.user.email,
      subject: 'Refund Processed',
      message: `Your refund for order #${order._id} has been processed. The amount will be credited to your original payment method.`
    });

    res.status(200).json({
      status: 'success',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
}; 