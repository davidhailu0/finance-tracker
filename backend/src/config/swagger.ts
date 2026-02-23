import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Tracker API",
      version: "1.0.0",
      description: "API documentation for Finance Tracker application - Track income and expenses",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        Transaction: {
          type: "object",
          required: ["amount", "type", "category", "description", "date"],
          properties: {
            id: {
              type: "integer",
              description: "Transaction ID",
            },
            userId: {
              type: "integer",
              description: "User ID",
            },
            amount: {
              type: "number",
              format: "decimal",
              description: "Transaction amount",
              example: 100.50,
            },
            type: {
              type: "string",
              enum: ["income", "expense"],
              description: "Transaction type",
              example: "income",
            },
            category: {
              type: "string",
              description: "Transaction category",
              example: "Salary",
            },
            description: {
              type: "string",
              description: "Transaction description",
              example: "Monthly salary payment",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Transaction date",
              example: "2024-01-15T00:00:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Summary: {
          type: "object",
          properties: {
            totalIncome: {
              type: "number",
              description: "Total income amount",
              example: 5000.00,
            },
            totalExpenses: {
              type: "number",
              description: "Total expenses amount",
              example: 2000.00,
            },
            balance: {
              type: "number",
              description: "Balance (income - expenses)",
              example: 3000.00,
            },
            byCategory: {
              type: "object",
              additionalProperties: {
                type: "number",
              },
              description: "Breakdown by category",
              example: {
                "income-Salary": 5000.00,
                "expense-Food": 500.00,
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "john@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
              },
              description: "Validation errors",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Transactions",
        description: "Transaction management endpoints",
      },
      {
        name: "Users",
        description: "User profile endpoints",
      },
    ],
  },
  apis: [
    path.join(__dirname, "..", "routes", "*.ts"),
    path.join(__dirname, "..", "routes", "*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Finance Tracker API Documentation",
  }));
  
  // Serve the raw swagger spec as JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
