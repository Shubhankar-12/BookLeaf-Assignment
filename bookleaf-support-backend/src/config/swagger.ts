import type { Options } from "swagger-jsdoc";
import { config } from "./env";
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
} from "../constants/ticket";

const BOOK_STATUSES = [
  "Published & Live",
  "In Production - Cover Design",
  "In Production - Typesetting",
  "In Production - Editing",
  "In Production - Proofreading",
  "Out of Print",
] as const;

const ROLES = ["ADMIN", "AUTHOR"] as const;
const SENDER_TYPES = ["AUTHOR", "ADMIN", "SYSTEM"] as const;

export const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "BookLeaf Support Backend API",
      version: "0.1.0",
      description:
        "AI-assisted author support backend for BookLeaf. Issue a Bearer JWT via POST /auth/login, then authorize every other request with it. Admins and authors share a single token format — role is encoded as a claim.",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api`,
        description: "Local server",
      },
    ],
    tags: [
      { name: "Auth", description: "Login, logout, current user" },
      { name: "Books", description: "Author + admin book reads" },
      { name: "Tickets", description: "Author-facing support tickets" },
      { name: "Admin", description: "Admin queue, overrides, AI drafts" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Bearer JWT issued by POST /auth/login.",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          required: ["success", "message", "data"],
          properties: {
            success: { type: "boolean", enum: [true] },
            message: { type: "string" },
            data: {
              description:
                "Endpoint-specific payload. See each endpoint for the concrete shape.",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["success", "error"],
          properties: {
            success: { type: "boolean", enum: [false] },
            error: { type: "string", example: "Validation failed" },
            details: {
              description:
                "Optional structured detail. For validation errors this is a string[] of field-prefixed issues.",
            },
          },
        },
        UserRole: { type: "string", enum: [...ROLES] },
        SenderType: { type: "string", enum: [...SENDER_TYPES] },
        TicketStatus: { type: "string", enum: [...TICKET_STATUSES] },
        TicketPriority: { type: "string", enum: [...TICKET_PRIORITIES] },
        TicketCategory: { type: "string", enum: [...TICKET_CATEGORIES] },
        BookStatus: { type: "string", enum: [...BOOK_STATUSES] },
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "65f1b2c3d4e5f6a7b8c9d0e1" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            role: { $ref: "#/components/schemas/UserRole" },
          },
        },
        Book: {
          type: "object",
          properties: {
            id: { type: "string", example: "65f1b2c3d4e5f6a7b8c9d0e1" },
            authorId: { type: "string", example: "65f1b2c3d4e5f6a7b8c9d0e2" },
            book_id: { type: "string", nullable: true, example: "BK001" },
            title: { type: "string" },
            isbn: { type: "string", nullable: true },
            genre: { type: "string", nullable: true },
            publication_date: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            status: { $ref: "#/components/schemas/BookStatus" },
            mrp: { type: "number", nullable: true },
            author_royalty_per_copy: { type: "number", nullable: true },
            total_copies_sold: { type: "integer" },
            total_royalty_earned: { type: "number" },
            royalty_paid: { type: "number" },
            royalty_pending: { type: "number" },
            last_royalty_payout_date: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            print_partner: { type: "string", nullable: true },
            available_on: { type: "array", items: { type: "string" } },
            currency: { type: "string", example: "INR" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AiMetadata: {
          type: "object",
          properties: {
            category: {
              $ref: "#/components/schemas/TicketCategory",
              nullable: true,
            },
            priority: {
              $ref: "#/components/schemas/TicketPriority",
              nullable: true,
            },
            confidence: { type: "number", nullable: true },
            model: { type: "string", nullable: true },
            source: {
              type: "string",
              enum: ["AI", "FALLBACK"],
              nullable: true,
            },
            classifiedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            latencyMs: { type: "integer", nullable: true },
            tokens: { type: "integer", nullable: true },
          },
        },
        Ticket: {
          type: "object",
          properties: {
            id: { type: "string", example: "65f1b2c3d4e5f6a7b8c9d0e1" },
            authorId: { type: "string" },
            bookId: { type: "string", nullable: true },
            subject: { type: "string" },
            description: { type: "string" },
            category: {
              $ref: "#/components/schemas/TicketCategory",
              nullable: true,
            },
            priority: {
              $ref: "#/components/schemas/TicketPriority",
              nullable: true,
            },
            status: { $ref: "#/components/schemas/TicketStatus" },
            assignedTo: { type: "string", nullable: true },
            aiMetadata: { $ref: "#/components/schemas/AiMetadata" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Message: {
          type: "object",
          properties: {
            id: { type: "string" },
            ticketId: { type: "string" },
            senderType: { $ref: "#/components/schemas/SenderType" },
            senderId: { type: "string" },
            body: { type: "string" },
            internalOnly: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Activity: {
          type: "object",
          properties: {
            id: { type: "string" },
            ticketId: { type: "string" },
            actorId: { type: "string", nullable: true },
            actorType: {
              type: "string",
              enum: ["USER", "SYSTEM", "AI"],
            },
            type: {
              type: "string",
              enum: [
                "TICKET_CREATED",
                "STATUS_CHANGED",
                "CATEGORY_CHANGED",
                "PRIORITY_CHANGED",
                "ASSIGNED",
                "MESSAGE_ADDED",
                "INTERNAL_NOTE_ADDED",
                "AI_CLASSIFIED",
              ],
            },
            before: { nullable: true },
            after: { nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        TicketWithDetails: {
          allOf: [
            { $ref: "#/components/schemas/Ticket" },
            {
              type: "object",
              properties: {
                messages: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Message" },
                },
                activity: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Activity" },
                },
              },
            },
          ],
        },
      },
      responses: {
        ValidationError: {
          description: "Request failed schema validation.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                error: "Validation failed",
                details: ["body.subject: subject must be at least 3 chars"],
              },
            },
          },
        },
        Unauthorized: {
          description: "Missing or invalid JWT.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, error: "Not authenticated" },
            },
          },
        },
        Forbidden: {
          description: "Authenticated but lacking the required role/ownership.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, error: "Forbidden" },
            },
          },
        },
        NotFound: {
          description: "Resource does not exist or caller cannot see it.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { success: false, error: "Ticket not found" },
            },
          },
        },
        Conflict: {
          description: "Request conflicts with current resource state.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        RateLimited: {
          description: "Too many requests — retry after the window resets.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                error: "Too many requests, please try again later.",
              },
            },
          },
        },
        ServiceUnavailable: {
          description: "Dependent service (e.g. S3, AI) unavailable.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                error: "Upload service unavailable",
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/use_cases/**/doc.ts"],
};
