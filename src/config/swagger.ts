import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description:
        "API documentation for E-Commerce services including Products, Carts, and Discount calculations",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Health check endpoint",
      },
      {
        name: "Products",
        description: "Product management endpoints",
      },
      {
        name: "Carts",
        description: "Shopping cart management endpoints",
      },
      {
        name: "Discounts",
        description: "Discount calculation endpoints",
      },
    ],
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check endpoint",
          description: "Returns the health status of the API",
          responses: {
            "200": {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/HealthResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/products": {
        get: {
          tags: ["Products"],
          summary: "Get all products",
          description: "Retrieve a list of all available products",
          responses: {
            "200": {
              description: "List of products retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/carts": {
        get: {
          tags: ["Carts"],
          summary: "Get all carts",
          description: "Retrieve a list of all shopping carts",
          responses: {
            "200": {
              description: "List of carts retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Carts retrieved" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Cart" },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Carts"],
          summary: "Create a new cart",
          description: "Create a new shopping cart for a user with items",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateCartRequest" },
                example: {
                  userId: "user-001",
                  items: [
                    {
                      productId: "prod-001",
                      name: "T-Shirt",
                      category: "Clothing",
                      price: 350,
                      quantity: 2,
                    },
                  ],
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Cart created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 201 },
                      message: { type: "string", example: "Cart created" },
                      data: { $ref: "#/components/schemas/Cart" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request - Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/carts/{id}": {
        get: {
          tags: ["Carts"],
          summary: "Get cart by ID",
          description: "Retrieve a specific shopping cart by its ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The cart ID",
              example: "cart-001",
            },
          ],
          responses: {
            "200": {
              description: "Cart retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Cart retrieved" },
                      data: { $ref: "#/components/schemas/Cart" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Cart not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/discount/calculate-by-cart": {
        post: {
          tags: ["Discounts"],
          summary: "Calculate discount for a cart",
          description: `Calculate the total discount for a cart based on the provided campaigns.

**Campaign Categories (applied in order):**
1. **COUPON** - Applied first
2. **ON_TOP** - Applied second
3. **SEASONAL** - Applied last

---

## Campaign Types & Examples

### 1. FIXED_AMOUNT (Category: COUPON)
Deducts a fixed amount from the total.
\`\`\`json
{
  "type": "FIXED_AMOUNT",
  "category": "COUPON",
  "amount": 50
}
\`\`\`

---

### 2. PERCENTAGE (Category: COUPON)
Deducts a percentage from the total.
\`\`\`json
{
  "type": "PERCENTAGE",
  "category": "COUPON",
  "percentage": 10
}
\`\`\`

---

### 3. PERCENTAGE_BY_CATEGORY (Category: ON_TOP)
Deducts a percentage from items in a specific category.
- **itemCategory**: "Clothing" | "Accessories" | "Electronics"
\`\`\`json
{
  "type": "PERCENTAGE_BY_CATEGORY",
  "category": "ON_TOP",
  "itemCategory": "Clothing",
  "percentage": 15
}
\`\`\`

---

### 4. DISCOUNT_BY_POINTS (Category: ON_TOP)
Converts points to discount (1 point = 1 currency unit, max 20% of total).
\`\`\`json
{
  "type": "DISCOUNT_BY_POINTS",
  "category": "ON_TOP",
  "points": 100
}
\`\`\`

---

### 5. SPECIAL_CAMPAIGNS (Category: SEASONAL)
Every X amount spent, get Y discount.
\`\`\`json
{
  "type": "SPECIAL_CAMPAIGNS",
  "category": "SEASONAL",
  "everyAmount": 300,
  "discountAmount": 40
}
\`\`\`

---

## Full Request Example (Multiple Campaigns)
\`\`\`json
{
  "cartId": "cart-001",
  "campaigns": [
    {
      "type": "PERCENTAGE",
      "category": "COUPON",
      "percentage": 10
    },
    {
      "type": "PERCENTAGE_BY_CATEGORY",
      "category": "ON_TOP",
      "itemCategory": "Clothing",
      "percentage": 15
    },
    {
      "type": "SPECIAL_CAMPAIGNS",
      "category": "SEASONAL",
      "everyAmount": 300,
      "discountAmount": 40
    }
  ]
}
\`\`\``,
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DiscountCalculateByCartRequest",
                },
                examples: {
                  fixedAmount: {
                    summary: "Fixed amount coupon",
                    value: {
                      cartId: "cart-001",
                      campaigns: [
                        {
                          type: "FIXED_AMOUNT",
                          category: "COUPON",
                          amount: 50,
                        },
                      ],
                    },
                  },
                  percentage: {
                    summary: "Percentage coupon",
                    value: {
                      cartId: "cart-001",
                      campaigns: [
                        {
                          type: "PERCENTAGE",
                          category: "COUPON",
                          percentage: 10,
                        },
                      ],
                    },
                  },
                  percentageByCategory: {
                    summary: "Percentage by category (On Top)",
                    value: {
                      cartId: "cart-001",
                      campaigns: [
                        {
                          type: "PERCENTAGE_BY_CATEGORY",
                          category: "ON_TOP",
                          itemCategory: "Clothing",
                          percentage: 15,
                        },
                      ],
                    },
                  },
                  discountByPoints: {
                    summary: "Discount by points (On Top)",
                    value: {
                      cartId: "cart-001",
                      campaigns: [
                        {
                          type: "DISCOUNT_BY_POINTS",
                          category: "ON_TOP",
                          points: 100,
                        },
                      ],
                    },
                  },
                  specialCampaign: {
                    summary: "Special seasonal campaign",
                    value: {
                      cartId: "cart-001",
                      campaigns: [
                        {
                          type: "SPECIAL_CAMPAIGNS",
                          category: "SEASONAL",
                          everyAmount: 300,
                          discountAmount: 40,
                        },
                      ],
                    },
                  },
                  multipleCampaigns: {
                    summary: "Multiple campaigns combined",
                    value: {
                      cartId: "cart-001",
                      campaigns: [
                        {
                          type: "PERCENTAGE",
                          category: "COUPON",
                          percentage: 10,
                        },
                        {
                          type: "PERCENTAGE_BY_CATEGORY",
                          category: "ON_TOP",
                          itemCategory: "Clothing",
                          percentage: 15,
                        },
                        {
                          type: "SPECIAL_CAMPAIGNS",
                          category: "SEASONAL",
                          everyAmount: 300,
                          discountAmount: 40,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Discount calculated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: {
                        type: "string",
                        example: "Discount calculated",
                      },
                      data: {
                        $ref: "#/components/schemas/DiscountCalculationResult",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request - Validation error or invalid campaign",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "404": {
              description: "Cart not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            status: { type: "integer", example: 200 },
            message: { type: "string", example: "Success" },
            data: { type: "object", nullable: true },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "integer", example: 400 },
            message: { type: "string", example: "Error message" },
            data: { type: "null", nullable: true },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", example: "prod-001" },
            name: { type: "string", example: "T-Shirt" },
            price: { type: "number", example: 350 },
            category: { type: "string", example: "Clothing" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: { type: "string", example: "item-001" },
            productId: { type: "string", example: "prod-001" },
            name: { type: "string", example: "T-Shirt" },
            category: { type: "string", example: "Clothing" },
            price: { type: "number", example: 350 },
            quantity: { type: "integer", example: 2 },
          },
        },
        Cart: {
          type: "object",
          properties: {
            id: { type: "string", example: "cart-001" },
            userId: { type: "string", example: "user-001" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateCartItemRequest: {
          type: "object",
          required: ["productId", "name", "category", "price", "quantity"],
          properties: {
            productId: { type: "string", example: "prod-001" },
            name: { type: "string", example: "T-Shirt" },
            category: { type: "string", example: "Clothing" },
            price: { type: "number", example: 350 },
            quantity: { type: "integer", minimum: 1, example: 2 },
          },
        },
        CreateCartRequest: {
          type: "object",
          required: ["userId", "items"],
          properties: {
            userId: { type: "string", example: "user-001" },
            items: {
              type: "array",
              minItems: 1,
              items: { $ref: "#/components/schemas/CreateCartItemRequest" },
            },
          },
        },
        CampaignCategory: {
          type: "string",
          enum: ["COUPON", "ON_TOP", "SEASONAL"],
        },
        CampaignType: {
          type: "string",
          enum: [
            "FIXED_AMOUNT",
            "PERCENTAGE",
            "PERCENTAGE_BY_CATEGORY",
            "DISCOUNT_BY_POINTS",
            "SPECIAL_CAMPAIGNS",
          ],
        },
        ItemCategory: {
          type: "string",
          enum: ["Clothing", "Accessories", "Electronics"],
        },
        FixedAmountCampaign: {
          type: "object",
          required: ["type", "category", "amount"],
          properties: {
            type: { type: "string", enum: ["FIXED_AMOUNT"] },
            category: { type: "string", enum: ["COUPON"] },
            amount: { type: "number", minimum: 0, example: 50 },
          },
        },
        PercentageCampaign: {
          type: "object",
          required: ["type", "category", "percentage"],
          properties: {
            type: { type: "string", enum: ["PERCENTAGE"] },
            category: { type: "string", enum: ["COUPON"] },
            percentage: {
              type: "number",
              minimum: 0,
              maximum: 100,
              example: 10,
            },
          },
        },
        PercentageByCategoryCampaign: {
          type: "object",
          required: ["type", "category", "itemCategory", "percentage"],
          properties: {
            type: { type: "string", enum: ["PERCENTAGE_BY_CATEGORY"] },
            category: { type: "string", enum: ["ON_TOP"] },
            itemCategory: { $ref: "#/components/schemas/ItemCategory" },
            percentage: {
              type: "number",
              minimum: 0,
              maximum: 100,
              example: 15,
            },
          },
        },
        DiscountByPointsCampaign: {
          type: "object",
          required: ["type", "category", "points"],
          properties: {
            type: { type: "string", enum: ["DISCOUNT_BY_POINTS"] },
            category: { type: "string", enum: ["ON_TOP"] },
            points: { type: "integer", minimum: 1, example: 100 },
          },
        },
        SpecialCampaign: {
          type: "object",
          required: ["type", "category", "everyAmount", "discountAmount"],
          properties: {
            type: { type: "string", enum: ["SPECIAL_CAMPAIGNS"] },
            category: { type: "string", enum: ["SEASONAL"] },
            everyAmount: { type: "number", minimum: 0, example: 300 },
            discountAmount: { type: "number", minimum: 0, example: 40 },
          },
        },
        Campaign: {
          oneOf: [
            { $ref: "#/components/schemas/FixedAmountCampaign" },
            { $ref: "#/components/schemas/PercentageCampaign" },
            { $ref: "#/components/schemas/PercentageByCategoryCampaign" },
            { $ref: "#/components/schemas/DiscountByPointsCampaign" },
            { $ref: "#/components/schemas/SpecialCampaign" },
          ],
        },
        DiscountCalculateByCartRequest: {
          type: "object",
          required: ["cartId", "campaigns"],
          properties: {
            cartId: { type: "string", example: "cart-001" },
            campaigns: {
              type: "array",
              minItems: 1,
              items: { $ref: "#/components/schemas/Campaign" },
            },
          },
        },
        DiscountList: {
          type: "object",
          properties: {
            campaignType: { $ref: "#/components/schemas/CampaignType" },
            category: { $ref: "#/components/schemas/CampaignCategory" },
            description: {
              type: "string",
              example: "Fixed amount discount of 50",
            },
            discountAmount: { type: "number", example: 50 },
            priceBeforeDiscount: { type: "number", example: 1000 },
            priceAfterDiscount: { type: "number", example: 950 },
          },
        },
        DiscountCalculationResult: {
          type: "object",
          properties: {
            originalPrice: { type: "number", example: 1000 },
            totalDiscount: { type: "number", example: 150 },
            finalPrice: { type: "number", example: 850 },
            discountList: {
              type: "array",
              items: { $ref: "#/components/schemas/DiscountList" },
            },
            appliedCampaigns: {
              type: "array",
              items: { $ref: "#/components/schemas/Campaign" },
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "OK" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export default swaggerSpec;
