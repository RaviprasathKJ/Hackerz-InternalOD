import serverless from 'serverless-http';
import app from './app';
import { Response } from 'express';
import { sucess } from './status';
import { Connect } from './config/config';

Connect();

app.get('/', (_, res: Response) => {
  res.status(sucess.code).send(sucess.mess);
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 6969;
  app.listen(PORT, () => {
  });
}

// Use serverless for Vercel deployment
export const handler = serverless(app);
