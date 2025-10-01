"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
// utils/tokenGeneration.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
// Updated to accept id and role as separate parameters
const generateAccessToken = (id, role) => {
    return jsonwebtoken_1.default.sign({
        _id: id,
        role,
    }, jwtSecret, { expiresIn: "7h" });
};
exports.generateAccessToken = generateAccessToken;
