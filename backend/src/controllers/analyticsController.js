import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { isPaid: true };

    if (startDate && endDate) {
      query.paidAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$paidAt' }
          },
          totalSales: { $sum: '$totalPrice' },
          numberOfOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: sales
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private/Admin
export const getProductAnalytics = async (req, res, next) => {
  try {
    // Top selling products
    const topSellingProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: 1,
          averageRating: '$product.rating'
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } })
      .select('name countInStock')
      .sort('countInStock');

    res.status(200).json({
      status: 'success',
      data: {
        topSellingProducts,
        lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer analytics
// @route   GET /api/analytics/customers
// @access  Private/Admin
export const getCustomerAnalytics = async (req, res, next) => {
  try {
    // Total customers
    const totalCustomers = await User.countDocuments({ isAdmin: false });

    // New customers this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newCustomers = await User.countDocuments({
      isAdmin: false,
      createdAt: { $gte: startOfMonth }
    });

    // Top customers by purchase amount
    const topCustomers = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          ordersCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          totalSpent: 1,
          ordersCount: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalCustomers,
        newCustomers,
        topCustomers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order analytics
// @route   GET /api/analytics/orders
// @access  Private/Admin
export const getOrderAnalytics = async (req, res, next) => {
  try {
    // Order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Average order value
    const averageOrderValue = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          average: { $avg: '$totalPrice' }
        }
      }
    ]);

    // Order fulfillment time
    const fulfillmentTime = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          isDelivered: true,
          paidAt: { $exists: true },
          deliveredAt: { $exists: true }
        }
      },
      {
        $project: {
          fulfillmentTime: {
            $divide: [
              { $subtract: ['$deliveredAt', '$paidAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageFulfillmentTime: { $avg: '$fulfillmentTime' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        orderStatusStats,
        averageOrderValue: averageOrderValue[0]?.average || 0,
        averageFulfillmentTime: fulfillmentTime[0]?.averageFulfillmentTime || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = async (req, res, next) => {
  try {
    // Monthly revenue
    const monthlyRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' }
          },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Revenue by payment method
    const revenueByPaymentMethod = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: '$paymentMethod',
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          category: '$category.name',
          revenue: 1
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        monthlyRevenue,
        revenueByPaymentMethod,
        revenueByCategory
      }
    });
  } catch (error) {
    next(error);
  }
}; 