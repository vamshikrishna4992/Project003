import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    variant: {
      name: String,
      option: String
    }
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentInfo: {
    id: String,
    status: String,
    type: String,
    update_time: String
  },
  paymentMethod: {
    type: String,
    required: true
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: Date,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  notes: String,
  discount: {
    code: String,
    amount: Number
  },
  refund: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: null
    },
    amount: Number,
    reason: String,
    processedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total price
orderSchema.methods.calculateTotalPrice = function() {
  this.itemsPrice = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  
  if (this.discount?.amount) {
    this.totalPrice -= this.discount.amount;
  }
};

// Pre-save middleware to calculate total price
orderSchema.pre('save', function(next) {
  this.calculateTotalPrice();
  next();
});

export default mongoose.model('Order', orderSchema); 