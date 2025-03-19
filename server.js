import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js' // Import MongoDB connection
import userRoutes from './routes/userRoutes.js'; // Import routes

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request body

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
