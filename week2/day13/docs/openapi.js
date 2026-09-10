const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'SDA Training API',
      version: '1.0.0',
      description: 'Advanced backend API for SDA training program',

      contact: {
        name: 'API Support',
        email: 'support@sda-training.com',
        url: 'https://sda-training.com/support'
      },

      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },

    servers: [
      {
        url: 'http://localhost:3013/api/v1',
        description: 'Development server'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        },

        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for authentication'
        }
      },

      schemas: {
        User: {
          type: 'object',

          required: [
            'name',
            'email',
            'role'
          ],

          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier',
              example: '1'
            },

            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User full name',
              example: 'John Doe'
            },

            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },

            role: {
              type: 'string',
              enum: [
                'user',
                'admin',
                'moderator'
              ],
              description: 'User role',
              example: 'user'
            },

            isActive: {
              type: 'boolean',
              description: 'User account status',
              example: true
            },

            avatar: {
              type: 'string',
              format: 'uri',
              description: 'User avatar URL',
              example: 'https://example.com/avatar.jpg'
            },

            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-01T00:00:00Z'
            },

            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-01T00:00:00Z'
            }
          }
        },

        Error: {
          type: 'object',

          properties: {
            success: {
              type: 'boolean',
              example: false
            },

            error: {
              type: 'object',

              properties: {
                message: {
                  type: 'string',
                  description: 'Error message',
                  example: 'Validation failed'
                },

                code: {
                  type: 'string',
                  description: 'Error code',
                  example: 'VALIDATION_ERROR'
                }
              }
            }
          }
        },

        Pagination: {
          type: 'object',

          properties: {
            page: {
              type: 'integer',
              minimum: 1,
              description: 'Current page number',
              example: 1
            },

            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              description: 'Items per page',
              example: 10
            },

            total: {
              type: 'integer',
              minimum: 0,
              description: 'Total number of items',
              example: 2
            },

            pages: {
              type: 'integer',
              minimum: 0,
              description: 'Total number of pages',
              example: 1
            }
          }
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: [
    './routes/**/*.js'
  ]
};

const specs = swaggerJSDoc(options);

module.exports = specs;