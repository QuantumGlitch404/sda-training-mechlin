# API Documentation Guide

## Documentation Standards

- **OpenAPI Specification**: Industry standard for API documentation.
- **Swagger UI**: Interactive documentation interface.
- **Completeness**: All endpoints, parameters, and responses are documented.
- **Accuracy**: Documentation matches actual API behavior.
- **Examples**: Examples are provided for API usage.

## Best Practices

- **Clear Structure**: Keep documentation organized and easy to navigate.
- **Consistent Format**: Use the same format for all endpoints.
- **Real Examples**: Use practical API examples.
- **Error Documentation**: Document common error responses.
- **Versioning**: Keep API versions clearly separated.

## Testing Integration

- **Postman Collections**: Use collections for API testing.
- **Interactive Testing**: Use Swagger UI to test endpoints.
- **Validation**: Check that documentation matches the API.
- **Maintenance**: Update documentation when the API changes.
- **Collaboration**: Keep documentation easy for team members to understand.

## Swagger UI

Open:

http://localhost:3013/api/v1/docs/

## Swagger JSON

Open:

http://localhost:3013/api/v1/docs/swagger.json

## Authentication

Protected API endpoints use:

```text
Authorization: Bearer demo-token
```

## Main Endpoints

### GET /api/v1/users

Returns a list of users.

### GET /api/v1/users/{id}

Returns one user.

### PUT /api/v1/users/{id}

Updates one user.

### DELETE /api/v1/users/{id}

Deletes one user.

## Testing

Run the API tests:

```bash
npm test
```

Generate the Postman collection:

```bash
npm run generate-postman
```
