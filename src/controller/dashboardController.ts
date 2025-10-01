import { Request, Response } from "express";
import Order from "../models/orderModel";
import { User } from "../models/userModel"; // ✅ fixed import
import Product from "../models/productmodels";

// Define a type for revenue analytics data
type RevenueData = {
    date: string;
    revenue: number;
    orders: number;
};

// GET DASHBOARD STATISTICS
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const orders = await Order.find();
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentOrders = await Order.countDocuments({
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
    } catch (error: any) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};

// GET REVENUE ANALYTICS
export const getRevenueAnalytics = async (req: Request, res: Response) => {
    try {
        const eightDaysAgo = new Date();
        eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

        const orders = await Order.find({
            createdAt: { $gte: eightDaysAgo }
        }).sort({ createdAt: 1 });

        // ✅ Explicitly type the revenueData array
        const revenueData: RevenueData[] = [];
        const dateMap = new Map<string, RevenueData>();

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
    } catch (error: any) {
        console.error("Revenue analytics error:", error);
        res.status(500).json({ message: "Error fetching revenue analytics", error: error.message });
    }
};
