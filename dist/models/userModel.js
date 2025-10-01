"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // ✅ email is unique
    password: { type: String, required: true },
    accessToken: { type: String },
    userRole: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });
exports.User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
