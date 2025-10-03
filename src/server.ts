import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/databaseconfiguration";
import userRoutes from "./routes/userrRoutes";
import categoryRoutes from "./routes/categoryPath";
import cartRoutes from "./routes/cartRoutes";
import productRoutes from "./routes/productPath";
import orderRoutes from "./routes/orderRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import contactEmailRoute from "./routes/contactEmailRoute";
import resetRoutes from "./routes/resetRoutes";
import { setupSwagger } from "./swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "https://ecommerce-frontend-project-cptz.vercel.app/",
      "https://ecommerce-frontend-project-cptz.vercel.app/",
      "https://ecommerce-frontend-project-cptz.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Connect to Database
connectDB();

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", contactEmailRoute);
app.use("/api/reset", resetRoutes);

// ✅ Swagger docs
setupSwagger(app);

// ✅ Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("API is running...");
});

// ✅ Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at https://kapee-server.onrender.com`);
  console.log(`📄 Swagger docs available at https://kapee-server.onrender.com/api-docs`);
});
