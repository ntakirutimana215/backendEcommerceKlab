"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueAnalytics = exports.getDashboardStats = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const userModel_1 = require("../models/userModel"); // ✅ fixed import
const productmodels_1 = __importDefault(require("../models/productmodels"));
// GET DASHBOARD STATISTICS
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalOrders = yield orderModel_1.default.countDocuments();
        const totalUsers = yield userModel_1.User.countDocuments();
        const totalProducts = yield productmodels_1.default.countDocuments();
        const orders = yield orderModel_1.default.find();
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentOrders = yield orderModel_1.default.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        res.status(200).json({
            totalSales,
            totalOrders,
            totalUsers,
            totalProducts,
            recentOrders,
            revenue: totalSales
        });
    }
    catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
});
exports.getDashboardStats = getDashboardStats;
// GET REVENUE ANALYTICS
const getRevenueAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eightDaysAgo = new Date();
        eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
        const orders = yield orderModel_1.default.find({
            createdAt: { $gte: eightDaysAgo }
        }).sort({ createdAt: 1 });
        // ✅ Explicitly type the revenueData array
        const revenueData = [];
        const dateMap = new Map();
        // Initialize all 8 days
        for (let i = 7; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
        }
        // Aggregate data
        orders.forEach(order => {
            const dateStr = order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const data = dateMap.get(dateStr);
            if (data) {
                data.revenue += order.totalAmount;
                data.orders += 1;
            }
        });
        // Convert map to array
        dateMap.forEach(value => revenueData.push(value));
        res.status(200).json(revenueData);
    }
    catch (error) {
        console.error("Revenue analytics error:", error);
        res.status(500).json({ message: "Error fetching revenue analytics", error: error.message });
    }
});
exports.getRevenueAnalytics = getRevenueAnalytics;
