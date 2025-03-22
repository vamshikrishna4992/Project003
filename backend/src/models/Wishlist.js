import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique products in wishlist
wishlistSchema.methods.addProduct = async function(productId) {
  if (!this.products.some(item => item.product.toString() === productId.toString())) {
    this.products.push({ product: productId });
    await this.save();
    return true;
  }
  return false;
};

// Remove product from wishlist
wishlistSchema.methods.removeProduct = async function(productId) {
  this.products = this.products.filter(item => item.product.toString() !== productId.toString());
  await this.save();
};

export default mongoose.model('Wishlist', wishlistSchema); 