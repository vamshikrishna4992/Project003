import Stripe from 'stripe';
import Order from '../models/Order.js';
import { createError } from '../utils/error.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check if user is authorized
    if (order.user.toString() !== req.user.id) {
      return next(createError(403, 'Not authorized to process payment for this order'));
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString()
      }
    });

    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create payment method
// @route   POST /api/payments/create-payment-method
// @access  Private
export const createPaymentMethod = async (req, res, next) => {
  try {
    const { paymentMethodId } = req.body;

    // Create payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: paymentMethodId
      }
    });

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: req.user.stripeCustomerId
    });

    // Set as default payment method
    await stripe.customers.update(req.user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        paymentMethod
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment methods
// @route   GET /api/payments/payment-methods
// @access  Private
export const getPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card'
    });

    res.status(200).json({
      status: 'success',
      data: {
        paymentMethods: paymentMethods.data
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete payment method
// @route   DELETE /api/payments/payment-methods/:id
// @access  Private
export const deletePaymentMethod = async (req, res, next) => {
  try {
    await stripe.paymentMethods.detach(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private/Admin
export const processRefund = async (req, res, next) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    if (!order.paymentInfo?.id) {
      return next(createError(400, 'No payment information found for this order'));
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentInfo.id,
      amount: Math.round(amount * 100), // Convert to cents
      reason: reason
    });

    // Update order refund status
    order.refund.status = 'completed';
    order.refund.processedAt = Date.now();
    order.refund.stripeRefundId = refund.id;
    await order.save();

    res.status(200).json({
      status: 'success',
      data: {
        refund
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: req.user.stripeCustomerId,
      limit: 100
    });

    res.status(200).json({
      status: 'success',
      data: {
        payments: paymentIntents.data
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Webhook handler
// @route   POST /api/payments/webhook
// @access  Public
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const order = await Order.findOne({
        'paymentInfo.id': paymentIntent.id
      });

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'processing';
        await order.save();
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedOrder = await Order.findOne({
        'paymentInfo.id': failedPayment.id
      });

      if (failedOrder) {
        failedOrder.status = 'payment_failed';
        await failedOrder.save();
      }
      break;

    case 'charge.refunded':
      const refund = event.data.object;
      const refundedOrder = await Order.findOne({
        'refund.stripeRefundId': refund.id
      });

      if (refundedOrder) {
        refundedOrder.refund.status = 'completed';
        refundedOrder.refund.processedAt = Date.now();
        await refundedOrder.save();
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}; 