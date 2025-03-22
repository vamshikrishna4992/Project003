import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  metrics: {
    totalSales: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    totalCustomers: {
      type: Number,
      default: 0
    },
    newCustomers: {
      type: Number,
      default: 0
    },
    totalProducts: {
      type: Number,
      default: 0
    },
    lowStockProducts: {
      type: Number,
      default: 0
    },
    outOfStockProducts: {
      type: Number,
      default: 0
    },
    topProducts: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      revenue: Number
    }],
    topCategories: [{
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      },
      revenue: Number
    }],
    salesByPaymentMethod: [{
      method: String,
      amount: Number
    }],
    salesByRegion: [{
      region: String,
      amount: Number
    }],
    customerRetention: {
      type: Number,
      default: 0
    },
    cartAbandonmentRate: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0
    },
    bounceRate: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    pageViews: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
analyticsSchema.index({ date: 1, type: 1 });

// Static method to get analytics for a date range
analyticsSchema.statics.getAnalytics = async function(startDate, endDate, type) {
  return await this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    },
    type: type
  }).sort({ date: 1 });
};

// Static method to get latest analytics
analyticsSchema.statics.getLatestAnalytics = async function(type) {
  return await this.findOne({ type })
    .sort({ date: -1 });
};

// Static method to aggregate analytics
analyticsSchema.statics.aggregateAnalytics = async function(startDate, endDate, type) {
  return await this.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lte: endDate
        },
        type: type
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$metrics.totalSales' },
        totalOrders: { $sum: '$metrics.totalOrders' },
        averageOrderValue: { $avg: '$metrics.averageOrderValue' },
        totalCustomers: { $sum: '$metrics.totalCustomers' },
        newCustomers: { $sum: '$metrics.newCustomers' },
        totalProducts: { $sum: '$metrics.totalProducts' },
        lowStockProducts: { $sum: '$metrics.lowStockProducts' },
        outOfStockProducts: { $sum: '$metrics.outOfStockProducts' },
        customerRetention: { $avg: '$metrics.customerRetention' },
        cartAbandonmentRate: { $avg: '$metrics.cartAbandonmentRate' },
        conversionRate: { $avg: '$metrics.conversionRate' },
        averageSessionDuration: { $avg: '$metrics.averageSessionDuration' },
        bounceRate: { $avg: '$metrics.bounceRate' },
        uniqueVisitors: { $sum: '$metrics.uniqueVisitors' },
        pageViews: { $sum: '$metrics.pageViews' }
      }
    }
  ]);
};

export default mongoose.model('Analytics', analyticsSchema); 