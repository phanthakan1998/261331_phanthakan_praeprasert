import express, { Request, Response } from "express";
import productRoutes from "./presentation/routes/product.route";
import discountRoutes from "./presentation/routes/discount.route";
import cartRoutes from "./presentation/routes/cart.route";
import { limiter } from "./config/limiter";
import corsOptions from "./config/cors";
import cors from "cors";
import { PORT } from "./config/dotenv";
const app = express();
app.use(limiter);
app.use(cors(corsOptions()));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

app.use(productRoutes);
app.use(discountRoutes);
app.use(cartRoutes);

app.listen(PORT);

export default app;
