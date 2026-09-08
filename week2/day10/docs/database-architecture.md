# Database Architecture Guide

## 1. Overview

Day 10 uses both MongoDB and PostgreSQL.

MongoDB is used as a document database.

PostgreSQL is used as a relational database.

The two database types are useful for different types of data and application needs.

## 2. Hybrid Database Strategy

```text
                    Application
                         |
              ┌──────────┴──────────┐
              |                     |
           MongoDB              PostgreSQL
              |                     |
     Flexible documents       Relational tables
              |                     |
      User documents          Structured data
```

## 3. MongoDB

MongoDB stores data as documents.

The main MongoDB model in this task is the `User` model.

MongoDB is useful when:

- Data has a flexible structure
- Documents contain nested information
- Schema changes may happen often
- Document-based storage is useful

## 4. MongoDB User Model

The User model contains:

- Name
- Email
- Password
- Role
- Avatar
- Active status
- Last login
- Preferences
- Profile information

The schema also contains indexes for:

- Email
- Role
- Active status
- Creation date

Passwords are hashed before they are stored.

## 5. MongoDB Connection Management

The MongoDB connection uses Mongoose.

The connection includes:

- Connection pooling
- Connection timeout
- Socket timeout
- Connection status
- Disconnect handling
- Reconnect handling
- Error handling

## 6. PostgreSQL

PostgreSQL stores structured data in relational tables.

The Day 10 project uses tables for:

- Users
- Products
- Orders
- Order items
- Reviews

## 7. PostgreSQL Relationships

```text
Users
  |
  └── Orders

Orders
  |
  └── Order Items
          |
          └── Products
                 |
                 └── Reviews
```

Foreign keys are used to connect related tables.

## 8. PostgreSQL Data Integrity

The database uses:

- Primary keys
- Foreign keys
- Unique constraints
- Check constraints
- Default values

Examples:

- User email must be unique
- Product price cannot be negative
- Product stock cannot be negative
- Review rating must be between 1 and 5
- Order item quantity must be greater than 0

## 9. PostgreSQL Connection Pool

The PostgreSQL connection uses a connection pool.

The pool helps manage multiple database connections instead of creating a new connection for every query.

The application records query timing and connection pool status.

## 10. Indexing

Indexes are created for frequently used fields.

Examples:

```text
users.email
users.role
users.is_active
users.created_at

products.category
products.price
products.created_at

orders.user_id
order_items.product_id
reviews.product_id
```

Indexes can make searches faster, but too many indexes can increase storage and write work.

## 11. Query Optimization

Parameterized queries are used instead of putting user input directly into SQL strings.

Filtering, sorting and pagination are supported.

Product statistics are calculated directly by PostgreSQL using SQL aggregation.

## 12. Migrations

Migrations are used to manage database schema changes.

The project contains:

```text
001_create_users_table.js
002_create_product_tables.js
```

Each migration provides:

- `up()` to create or change the schema
- `down()` to reverse the change

## 13. MongoDB vs PostgreSQL

| Feature | MongoDB | PostgreSQL |
| --- | --- | --- |
| Data model | Documents | Tables |
| Schema | Flexible | Structured |
| Relationships | Embedded or referenced | Foreign keys |
| Query style | MongoDB queries | SQL |
| Transactions | Supported | Strong relational transactions |
| Good for | Flexible document data | Structured relational data |

## 14. When to Use MongoDB

Use MongoDB when the application needs:

- Flexible document structures
- Nested objects
- Rapid schema changes
- Document-based data

## 15. When to Use PostgreSQL

Use PostgreSQL when the application needs:

- Strong relationships
- Structured tables
- Constraints
- Complex SQL queries
- Strong data consistency
- Relational reporting

## 16. Hybrid Architecture

A hybrid application can use both databases.

For example:

```text
Application
    |
    ├── User profile data
    |       ↓
    |    MongoDB
    |
    └── Orders and relational data
            ↓
        PostgreSQL
```

The choice depends on the data structure and application requirements.

## 17. Testing Checklist

- [ ] MongoDB connection works
- [ ] PostgreSQL connection works
- [ ] MongoDB User model works
- [ ] PostgreSQL Product model works
- [ ] Migrations work
- [ ] Migration rollback works
- [ ] Constraints work
- [ ] Foreign keys work
- [ ] Indexes exist
- [ ] Queries work
- [ ] Statistics queries work
- [ ] Connection pooling works

## 18. Day 10 Success Criteria

- MongoDB document database implemented
- PostgreSQL relational database implemented
- Hybrid database approach documented
- Indexes implemented
- Queries tested
- Database migrations implemented
- Data constraints implemented