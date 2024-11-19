import express from "express";
import cors from "cors";

import { BASE_ROUTE as USER_BR, router as userRoute } from "./routes/userRoute";
import { commonRoutes } from "./routes";
import { hodRoutes } from "./routes";
import { teamleadRoutes } from "./routes";

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Your routes
app.use('/api' + USER_BR, userRoute);
app.use('/api' + commonRoutes.BASE_ROUTE, commonRoutes.router);
app.use('/api' + hodRoutes.BASE_ROUTE, hodRoutes.router);
app.use('/api' + teamleadRoutes.BASE_ROUTE, teamleadRoutes.router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

export default app;