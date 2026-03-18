import express from "express";
import discountController from "../controllers/discount.controller";
import {
  discountCalculateByCartSchema,
  discountCalculateSchema,
} from "../validators/schemas";
import { validateBody } from "../middleware/validate.middleware";

const router = express.Router();

router.post(
  "/discount/calculate",
  validateBody(discountCalculateSchema),
  discountController.calculateDiscount,
);
router.post(
  "/discount/calculate-by-cart",
  validateBody(discountCalculateByCartSchema),
  discountController.calculateDiscountByCartId,
);

export default router;
