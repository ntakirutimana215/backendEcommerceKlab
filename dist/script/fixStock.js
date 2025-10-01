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
const mongoose_1 = __importDefault(require("mongoose"));
const productmodels_1 = __importDefault(require("../models/productmodels"));
function updateStock() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect("mongodb://localhost:27017/Ecom_db");
        yield productmodels_1.default.updateOne({ _id: "68d255a4ade9012512141cc5" }, { $set: { stock: 10 } });
        yield productmodels_1.default.updateOne({ _id: "68c1777cd360d8ac61f16f85" }, { $set: { stock: 20 } });
        yield productmodels_1.default.updateOne({ _id: "68c27d28cdae7514ed0f7d10" }, { $set: { stock: 5 } });
        console.log("Stock updated ✅");
        process.exit();
    });
}
updateStock();
