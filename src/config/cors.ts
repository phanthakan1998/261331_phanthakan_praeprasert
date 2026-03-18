import { CorsOptions } from "cors";
import { NODE_ENV } from "./dotenv";

const corsOptions: CorsOptions = {
  optionsSuccessStatus: 200,
};

export default (): CorsOptions => {
  if (NODE_ENV !== "local" && NODE_ENV !== "development") {
    return {
      ...corsOptions,
      credentials: true,
    };
  }

  return {
    ...corsOptions,
    origin: "*",
  };
};
