"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productPath_1 = __importDefault(require("./productPath"));
const categoryPath_1 = __importDefault(require("./categoryPath"));
const cartRoutes_1 = __importDefault(require("./cartRoutes"));
const express_1 = require("express");
const userrRoutes_1 = __importDefault(require("./userrRoutes"));
const mainRouter = (0, express_1.Router)();
mainRouter.use('/product', productPath_1.default);
mainRouter.use("/categories", categoryPath_1.default);
mainRouter.use("/cart", cartRoutes_1.default);
mainRouter.use("/user", userrRoutes_1.default);
exports.default = mainRouter;
