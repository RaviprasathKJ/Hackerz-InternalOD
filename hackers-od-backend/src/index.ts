import serverless from 'serverless-http';
import app from './app';
import { Response } from 'express';
import { sucess } from './status';
import { Connect } from './config/config';

// Connect to the database
Connect();

// Define the root endpoint
app.get('/', (_, res: Response) => {
  res.status(sucess.code).send({
    message: 'Backend is up and running!',
    status: 'success',
    details: 'The backend API is working as expected.',
  });
});

// For local development, run the Express app normally
if (process.env.NODE_ENV !== 'production') {
  // Start the Express server for local testing
  const PORT = process.env.PORT || 6969;
  app.listen(PORT, () => {
    console.log(`Server running in local development mode on port ${PORT}`);
  });
}

// Use serverless for Vercel deployment
export const handler = serverless(app);
