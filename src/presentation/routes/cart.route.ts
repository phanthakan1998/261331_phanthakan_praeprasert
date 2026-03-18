import express from "express";
import cartController from "../controllers/cart.controller";
import {
  createCartSchema,
  idParamSchema,
  userIdParamSchema,
} from "../validators/schemas";
import {
  validateBody,
  validateParams,
} from "../middleware/validate.middleware";

const router = express.Router();

router.get("/carts", cartController.getAllCarts);
router.get(
  "/carts/:id",
  validateParams(idParamSchema),
  cartController.getCartById,
);
router.get(
  "/carts/user/:userId",
  validateParams(userIdParamSchema),
  cartController.getCartByUserId,
);
router.post(
  "/carts",
  validateBody(createCartSchema),
  cartController.createCart,
);

export default router;
