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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const categoryModels_1 = __importDefault(require("../models/categoryModels"));
// Create Category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const category = new categoryModels_1.default({ name, description });
        yield category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.createCategory = createCategory;
// Get all categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryModels_1.default.find();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.getCategories = getCategories;
// Get single category
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryModels_1.default.findById(req.params.id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.getCategoryById = getCategoryById;
// Update Category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryModels_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.updateCategory = updateCategory;
// Delete Category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryModels_1.default.findByIdAndDelete(req.params.id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.deleteCategory = deleteCategory;
