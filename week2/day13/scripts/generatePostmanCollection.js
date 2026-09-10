const fs = require('fs');
const path = require('path');

const specs = require('../docs/openapi');

const generatePostmanCollection = (openApiSpecs) => {
  const collection = {
    info: {
      name: 'SDA Training API',
      description: 'API collection for SDA Training program',
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },

    auth: {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{jwt_token}}',
          type: 'string'
        }
      ]
    },

    variable: [
      {
        key: 'base_url',
        value: 'http://localhost:3013/api/v1',
        type: 'string'
      },
      {
        key: 'jwt_token',
        value: 'demo-token',
        type: 'string'
      }
    ],

    item: []
  };

  if (openApiSpecs.paths) {
    Object.keys(openApiSpecs.paths).forEach((apiPath) => {
      Object.keys(openApiSpecs.paths[apiPath]).forEach((method) => {
        const operation = openApiSpecs.paths[apiPath][method];

        const item = {
          name:
            operation.summary ||
            `${method.toUpperCase()} ${apiPath}`,

          request: {
            method: method.toUpperCase(),

            header: [],

            url: {
              raw: '{{base_url}}' + apiPath,
              host: ['{{base_url}}'],
              path: apiPath
                .split('/')
                .filter(Boolean)
            }
          },

          response: []
        };

        if (operation.security) {
          item.request.header.push({
            key: 'Authorization',
            value: 'Bearer {{jwt_token}}',
            type: 'text'
          });
        }

        if (operation.parameters) {
          operation.parameters.forEach((parameter) => {
            if (parameter.in === 'query') {
              if (!item.request.url.query) {
                item.request.url.query = [];
              }

              item.request.url.query.push({
                key: parameter.name,
                value:
                  parameter.schema?.default || '',
                description:
                  parameter.description || ''
              });
            }
          });
        }

        if (operation.requestBody) {
          item.request.body = {
            mode: 'raw',
            raw: JSON.stringify(
              {},
              null,
              2
            ),
            options: {
              raw: {
                language: 'json'
              }
            }
          };
        }

        collection.item.push(item);
      });
    });
  }

  return collection;
};

const collection =
  generatePostmanCollection(specs);

const outputPath = path.join(
  __dirname,
  '../docs/postman-collection.json'
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(collection, null, 2)
);

console.log(
  'Postman collection generated successfully!'
);

console.log(`Output: ${outputPath}`);

module.exports = {
  generatePostmanCollection
};