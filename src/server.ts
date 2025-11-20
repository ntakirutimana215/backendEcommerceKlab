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
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL as string,
].filter(Boolean); // remove undefined values

// ✅ Enable CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Connect to DB
connectDB();

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", contactEmailRoute);
app.use("/api/reset", resetRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running...");
  res.send("API is running...");
});

// ✅ Global Error Handler
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at https://kapee-server.onrender.com`);
  console.log(`📄 Swagger docs available at https://kapee-server.onrender.com/api-docs`);
});
