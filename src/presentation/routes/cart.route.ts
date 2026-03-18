import express from "express";
import cartController from "../controllers/cart.controller";
import { createCartSchema, idParamSchema } from "../validators/schemas";
import {
  validateBody,
  validateParams,
} from "../middleware/validate.middleware";

const router = express.Router();

/**
 * /carts:
 *   get:
 *     tags:
 *       - Carts
 *     summary: Get all carts
 *     description: Retrieve a list of all shopping carts
 *     responses:
 *       200:
 *         description: List of carts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Carts retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/carts", cartController.getAllCarts);

/**
 * /carts/{id}:
 *   get:
 *     tags:
 *       - Carts
 *     summary: Get cart by ID
 *     description: Retrieve a specific shopping cart by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *         example: cart-001
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Cart retrieved"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request - Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/carts/:id",
  validateParams(idParamSchema),
  cartController.getCartById,
);

/**
 * /carts:
 *   post:
 *     tags:
 *       - Carts
 *     summary: Create a new cart
 *     description: Create a new shopping cart for a user with items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCartRequest'
 *           example:
 *             userId: "user-001"
 *             items:
 *               - productId: "prod-001"
 *                 name: "T-Shirt"
 *                 category: "Clothing"
 *                 price: 350
 *                 quantity: 2
 *               - productId: "prod-002"
 *                 name: "Hat"
 *                 category: "Accessories"
 *                 price: 250
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Cart created"
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/carts",
  validateBody(createCartSchema),
  cartController.createCart,
);

export default router;
