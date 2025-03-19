import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User; // ✅ Add default export
