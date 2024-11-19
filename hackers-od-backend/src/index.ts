import serverless from 'serverless-http';
import app from './app';
import { Response } from 'express';
import { sucess } from './status';
import { Connect } from './config/config';

// Database connection handler with reconnection logic
const connectDB = async () => {
  try {
    await Connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Connect to database based on environment
if (process.env.NODE_ENV === 'production') {
  // In production, connect for each serverless instance
  app.use(async (req, _, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      next(error);
    }
  });
} else {
  // In development, connect once at startup
  connectDB();
}

// Define the root endpoint
app.get('/', (_, res: Response) => {
  res.status(sucess.code).json({
    message: sucess.mess,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: any, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 6969;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export handler for Vercel
const handler = serverless(app);
export default handler;

// Also export the app for testing purposes
export { app };