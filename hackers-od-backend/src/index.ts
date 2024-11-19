import serverless from 'serverless-http';
import app from './app';
import { Connect } from './config/config';

// Connect to the database
Connect();

// Root path handler
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// For Vercel, we need to export the serverless handler
module.exports = app;
export default app;

// Also export serverless wrapped handler
export const handler = serverless(app);