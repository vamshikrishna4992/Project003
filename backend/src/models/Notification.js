import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'product', 'system', 'promotion'],
    required: true
  },
  link: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  await this.save();
};

// Static method to create order notification
notificationSchema.statics.createOrderNotification = async function(userId, orderId, message) {
  return await this.create({
    user: userId,
    title: 'Order Update',
    message: message,
    type: 'order',
    link: `/orders/${orderId}`,
    priority: 'medium'
  });
};

// Static method to create product notification
notificationSchema.statics.createProductNotification = async function(userId, productId, message) {
  return await this.create({
    user: userId,
    title: 'Product Update',
    message: message,
    type: 'product',
    link: `/products/${productId}`,
    priority: 'low'
  });
};

// Static method to create system notification
notificationSchema.statics.createSystemNotification = async function(userId, message, priority = 'low') {
  return await this.create({
    user: userId,
    title: 'System Notification',
    message: message,
    type: 'system',
    priority: priority
  });
};

// Static method to create promotion notification
notificationSchema.statics.createPromotionNotification = async function(userId, message, link) {
  return await this.create({
    user: userId,
    title: 'Special Offer',
    message: message,
    type: 'promotion',
    link: link,
    priority: 'high',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
};

export default mongoose.model('Notification', notificationSchema); 