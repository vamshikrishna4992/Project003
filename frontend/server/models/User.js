import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: String,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash refresh token before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('refreshToken')) {
    this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
  }
  next();
});

export default mongoose.model('User', userSchema); 