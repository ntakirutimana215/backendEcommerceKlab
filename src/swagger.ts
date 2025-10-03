// swagger.ts
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { OpenAPIV3 } from "openapi-types";

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Kappe E-commerce API",
    version: "1.0.0",
    description: "REST API for authentication, products, categories, cart, orders, contact, and reset password",
  },
  servers: [
    { url: process.env.PUBLIC_API_BASE_URL || "http://localhost:5000" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullname: { type: "string" },
          email: { type: "string" },
          userRole: { type: "string", enum: ["user", "admin"] },
        },
      },
      Register: {
        type: "object",
        required: ["fullname", "email", "password", "confirmpassword"],
        properties: {
          fullname: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          confirmpassword: { type: "string" },
          userRole: { type: "string", enum: ["user", "admin"] },
        },
      },
      Login: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          price: { type: "number" },
          category: { type: "string" },
          stock: { type: "number" },
          featured: { type: "boolean" },
        },
      },
      Category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          productId: { type: "string" },
          qty: { type: "number" },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
          status: { type: "string", enum: ["pending", "paid", "shipped"] },
          total: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Contact: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          message: { type: "string" },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string" },
        },
      },
      ResetPassword: {
        type: "object",
        required: ["email", "otp", "newPassword"],
        properties: {
          email: { type: "string" },
          otp: { type: "string" },
          newPassword: { type: "string" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/users/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Register" } },
          },
        },
        responses: {
          201: { description: "User created successfully" },
          400: { description: "Bad Request: missing fields or passwords do not match" },
          409: { description: "Email already registered" },
        },
      },
    },
    "/api/users/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Login" } },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid email or password" },
        },
      },
    },
    "/api/users/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current logged-in user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "User ID" },
        ],
        responses: { 200: { description: "OK" }, 404: { description: "User not found" } },
      },
    },

    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "multipart/form-data": { schema: { $ref: "#/components/schemas/Product" } } },
        },
        responses: { 201: { description: "Created" }, 401: { description: "Unauthorized" } },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 404: { description: "Not Found" } },
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "multipart/form-data": { schema: { $ref: "#/components/schemas/Product" } } } },
        responses: { 200: { description: "Updated" }, 401: { description: "Unauthorized" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 204: { description: "No Content" }, 401: { description: "Unauthorized" } },
      },
    },

    "/api/categories": {
      get: { tags: ["Categories"], summary: "Get all categories", responses: { 200: { description: "OK" } } },
      post: {
        tags: ["Categories"],
        summary: "Create a category",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/api/categories/{id}": {
      get: { tags: ["Categories"], summary: "Get category by ID", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" }, 404: { description: "Not Found" } } },
      put: { tags: ["Categories"], summary: "Update category", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } } }, responses: { 200: { description: "Updated" } } },
      delete: { tags: ["Categories"], summary: "Delete category", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 204: { description: "Deleted" } } },
    },

    "/api/cart": {
      get: { tags: ["Cart"], summary: "Get current user's cart", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } },
    },
    "/api/cart/add": {
      post: { tags: ["Cart"], summary: "Add item to cart", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartItem" } } } }, responses: { 200: { description: "OK" } } },
    },
    "/api/cart/{productId}": {
      put: { tags: ["Cart"], summary: "Update cart item", security: [{ bearerAuth: [] }], parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartItem" } } } }, responses: { 200: { description: "OK" } } },
      delete: { tags: ["Cart"], summary: "Remove cart item", security: [{ bearerAuth: [] }], parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } },
    },

    "/api/order/create-from-cart": {
      post: { tags: ["Orders"], summary: "Create order from cart", security: [{ bearerAuth: [] }], responses: { 201: { description: "Created" } } },
    },
    "/api/order/my-orders": {
      get: { tags: ["Orders"], summary: "Get user's orders", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } },
    },
    "/api/order/all": {
      get: { tags: ["Orders"], summary: "Get all orders (admin)", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } },
    },
    "/api/order/update-status/{orderId}": {
      put: { tags: ["Orders"], summary: "Update order status", security: [{ bearerAuth: [] }], parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } },
    },

    "/api/contact/send-email": {
      post: { tags: ["Contact"], summary: "Send contact email", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Contact" } } } }, responses: { 201: { description: "Created" } } },
    },

    "/api/reset/request-reset": {
      post: { tags: ["Reset"], summary: "Request password reset", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ResetPasswordRequest" } } } }, responses: { 200: { description: "OTP sent" } } },
    },
    "/api/reset/reset-password": {
      post: { tags: ["Reset"], summary: "Reset password with OTP", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ResetPassword" } } } }, responses: { 200: { description: "Password reset" } } },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
