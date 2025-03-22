import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  images: [{
    type: String,
    required: [true, 'Please add at least one image']
  }],
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  variants: [{
    name: String,
    options: [{
      name: String,
      price: Number,
      stock: Number
    }]
  }],
  specifications: [{
    name: String,
    value: String
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a vendor']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  discountEndDate: Date,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }

  const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
  this.averageRating = sum / this.ratings.length;
  this.numReviews = this.ratings.length;
};

// Calculate discounted price
productSchema.methods.getDiscountedPrice = function() {
  if (this.discount > 0 && (!this.discountEndDate || this.discountEndDate > Date.now())) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
};

// Pre-save middleware to calculate average rating
productSchema.pre('save', function(next) {
  this.calculateAverageRating();
  next();
});

export default mongoose.model('Product', productSchema); 