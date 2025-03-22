import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
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
    variant: {
      name: String,
      option: String
    }
  }],
  discount: {
    code: String,
    amount: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate cart total
cartSchema.methods.calculateTotal = async function() {
  let total = 0;
  
  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (product) {
      let price = product.price;
      
      // Apply variant price if exists
      if (item.variant) {
        const variant = product.variants.find(v => 
          v.name === item.variant.name && 
          v.options.some(o => o.name === item.variant.option)
        );
        if (variant) {
          const option = variant.options.find(o => o.name === item.variant.option);
          if (option) {
            price = option.price;
          }
        }
      }
      
      // Apply discount if exists
      if (product.discount > 0 && (!product.discountEndDate || product.discountEndDate > Date.now())) {
        price = price * (1 - product.discount / 100);
      }
      
      total += price * item.quantity;
    }
  }
  
  // Apply cart discount if exists
  if (this.discount?.amount) {
    total -= this.discount.amount;
  }
  
  return Math.max(0, total);
};

export default mongoose.model('Cart', cartSchema); 