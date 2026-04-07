import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Appointment Booking System API",
      version: "1.0.0",
      description: "Complete API documentation for Appointment Booking System",
    },
    servers: [
      {
        url: "https://gdg-appointment-booking-system.onrender.com",
        description: "Production Server",
      },
      {
        url: "http://localhost:7000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      // ========== SCHEMAS DEFINITION ==========
      schemas: {
        // User Schema
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            name: { type: "string", example: "Laloo Hailu" },
            email: { type: "string", example: "laloo@example.com" },
            role: { type: "string", enum: ["user", "provider", "admin"], example: "user" },
            phone: { type: "string", example: "+251911234567" },
            avatar: { type: "string", example: "https://example.com/avatar.jpg" },
            active: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        
        // Provider Schema
        Provider: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c86" },
            user: { $ref: "#/components/schemas/User" },
            businessName: { type: "string", example: "Laloo Hailu Professional Services" },
            specialty: { type: "string", example: "Business Consultancy" },
            description: { type: "string", example: "Professional consultant based in Addis Ababa" },
            location: { type: "string", example: "Addis Ababa, Ethiopia" },
            isApproved: { type: "boolean", example: true },
            approvedAt: { type: "string", format: "date-time" },
            active: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        
        // Service Schema
        Service: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c87" },
            provider: { type: "string", example: "60d21b4667d0d8992e610c86" },
            name: { type: "string", example: "Business Consultation" },
            description: { type: "string", example: "One-hour business consultation" },
            category: { type: "string", example: "Consulting" },
            duration: { type: "number", example: 60, description: "Minutes" },
            price: { type: "number", example: 1500, description: "ETB" },
            active: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        
        // Appointment Schema
        Appointment: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c88" },
            userId: { type: "string", example: "60d21b4667d0d8992e610c85" },
            providerId: { type: "string", example: "60d21b4667d0d8992e610c86" },
            serviceId: { type: "string", example: "60d21b4667d0d8992e610c87" },
            date: { type: "string", format: "date", example: "2024-12-25" },
            startTime: { type: "string", example: "14:00" },
            endTime: { type: "string", example: "15:00" },
            status: { type: "string", enum: ["pending", "confirmed", "cancelled", "completed"], example: "confirmed" },
            notes: { type: "string", example: "I will be coming from Bole" },
            cancelledAt: { type: "string", format: "date-time" },
            cancellationReason: { type: "string" },
            confirmedAt: { type: "string", format: "date-time" },
            completedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        
        // Availability Schema
        Availability: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c89" },
            providerId: { type: "string", example: "60d21b4667d0d8992e610c86" },
            date: { type: "string", format: "date", example: "2024-12-25" },
            startTime: { type: "string", example: "09:00" },
            endTime: { type: "string", example: "17:00" },
            isRecurring: { type: "boolean", example: false },
            recurringDays: { type: "array", items: { type: "integer" }, example: [1, 3, 5] },
            isBooked: { type: "boolean", example: false },
            appointmentId: { type: "string" },
            maxBookings: { type: "number", example: 1 },
            currentBookings: { type: "number", example: 0 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        
        // Review Schema
        Review: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c90" },
            provider: { type: "string", example: "60d21b4667d0d8992e610c86" },
            user: { $ref: "#/components/schemas/User" },
            appointment: { type: "string", example: "60d21b4667d0d8992e610c88" },
            rating: { type: "number", minimum: 1, maximum: 5, example: 5 },
            comment: { type: "string", example: "Excellent service from Laloo Hailu!" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        
        // Notification Schema
        Notification: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            type: { type: "string", enum: ["confirmation", "reminder", "cancelled", "rescheduled", "completed", "response", "review", "promotion", "system", "update"] },
            title: { type: "string", example: "Appointment Confirmed" },
            message: { type: "string", example: "Your appointment has been confirmed" },
            data: { type: "object" },
            isRead: { type: "boolean", example: false },
            readAt: { type: "string", format: "date-time" },
            link: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        
        // Request Schemas
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Laloo Hailu" },
            email: { type: "string", format: "email", example: "laloo@example.com" },
            password: { type: "string", format: "password", minLength: 8, example: "password123" },
            role: { type: "string", enum: ["user", "provider"], default: "user" },
            phone: { type: "string", example: "+251911234567" },
          },
        },
        
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "laloo@example.com" },
            password: { type: "string", format: "password", example: "password123" },
          },
        },
        
        CreateAppointmentRequest: {
          type: "object",
          required: ["providerId", "serviceId", "date", "startTime", "endTime"],
          properties: {
            providerId: { type: "string", example: "60d21b4667d0d8992e610c86" },
            serviceId: { type: "string", example: "60d21b4667d0d8992e610c87" },
            date: { type: "string", format: "date", example: "2024-12-25" },
            startTime: { type: "string", example: "14:00" },
            endTime: { type: "string", example: "15:00" },
            notes: { type: "string", example: "Please call upon arrival" },
          },
        },
        
        CreateProviderRequest: {
          type: "object",
          required: ["businessName"],
          properties: {
            businessName: { type: "string", example: "Laloo Hailu Professional Services" },
            specialty: { type: "string", example: "Business Consultancy" },
            description: { type: "string", example: "Professional consultant" },
            location: { type: "string", example: "Addis Ababa, Ethiopia" },
          },
        },
        
        CreateServiceRequest: {
          type: "object",
          required: ["name", "duration", "price"],
          properties: {
            name: { type: "string", example: "Business Consultation" },
            description: { type: "string", example: "One-hour consultation" },
            category: { type: "string", example: "Consulting" },
            duration: { type: "number", example: 60 },
            price: { type: "number", example: 1500 },
          },
        },
        
        CreateReviewRequest: {
          type: "object",
          required: ["providerId", "rating"],
          properties: {
            providerId: { type: "string", example: "60d21b4667d0d8992e610c86" },
            appointmentId: { type: "string" },
            rating: { type: "number", minimum: 1, maximum: 5, example: 5 },
            comment: { type: "string", example: "Excellent service!" },
          },
        },
        
        // Response Schemas
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            error: { type: "string" },
          },
        },
        
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "array" },
            pagination: {
              type: "object",
              properties: {
                page: { type: "number", example: 1 },
                limit: { type: "number", example: 10 },
                total: { type: "number", example: 100 },
                pages: { type: "number", example: 10 },
              },
            },
          },
        },
        
        SystemStats: {
          type: "object",
          properties: {
            users: { type: "number", example: 150 },
            providers: { type: "number", example: 25 },
            appointments: { type: "number", example: 500 },
            totalRevenue: { type: "number", example: 750000 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);
export { swaggerSpec };
