"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const databaseconfiguration_1 = require("./config/databaseconfiguration");
const userrRoutes_1 = __importDefault(require("./routes/userrRoutes"));
const categoryPath_1 = __importDefault(require("./routes/categoryPath"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const productPath_1 = __importDefault(require("./routes/productPath"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const contactEmailRoute_1 = __importDefault(require("./routes/contactEmailRoute"));
const resetRoutes_1 = __importDefault(require("./routes/resetRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000; // default 5000
// ✅ Enable CORS
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false, // let cors handle OPTIONS automatically
    optionsSuccessStatus: 204, // respond OK for preflight
}));
// ✅ Middleware
app.use(express_1.default.json()); // JSON payloads
app.use(express_1.default.urlencoded({ extended: true })); // form-data text fields
app.use((0, morgan_1.default)("dev")); // logging requests
// ✅ Connect to Database
(0, databaseconfiguration_1.connectDB)();
// ✅ Routes
app.use("/api/users", userrRoutes_1.default);
app.use("/api/categories", categoryPath_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/products", productPath_1.default);
app.use("/api/order", orderRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api", contactEmailRoute_1.default);
app.use("/api/reset", resetRoutes_1.default);
app.get("/", (_req, res) => {
    res.send(" API is running...");
});
// ✅ Global error handler
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});
// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
