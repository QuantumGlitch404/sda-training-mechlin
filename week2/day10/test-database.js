require("dotenv").config();

const fs = require("fs");

const mongo =
  require("./database/mongodb");

const postgresql =
  require("./database/postgresql");

const User =
  require("./models/User");

const Product =
  require("./models/Product");

const usersMigration =
  require(
    "./migrations/001_create_users_table"
  );

const productMigration =
  require(
    "./migrations/002_create_product_tables"
  );

function printSection(
  title,
  data
) {
  console.log("\n");
  console.log("=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));

  console.log(
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

async function main() {
  try {
    fs.mkdirSync(
      "logs",
      {
        recursive: true
      }
    );

    console.log(
      "Starting Day 10 database tests..."
    );

    // -------------------------
    // MongoDB
    // -------------------------

    const mongoStatus =
      await mongo.connect();

    printSection(
      "1. MongoDB Connection",
      mongoStatus
    );

    const testEmail =
      `day10-${Date.now()}@example.com`;

    const user =
      await User.create({
        name: "Day 10 Test User",
        email: testEmail,
        password: "Password123!",
        role: "user",
        preferences: {
          theme: "dark",
          notifications: {
            email: true,
            push: true
          }
        },
        profile: {
          bio: "Day 10 database test user",
          location: "India"
        }
      });

    printSection(
      "2. MongoDB User Model",
      {
        id:
          user._id.toString(),
        name:
          user.name,
        email:
          user.email,
        role:
          user.role,
        fullName:
          user.fullName,
        passwordStoredAsHash:
          user.password !==
          "Password123!"
      }
    );

    const token =
      user.generateAuthToken();

    printSection(
      "3. MongoDB JWT",
      {
        tokenCreated:
          Boolean(token),
        tokenLength:
          token.length
      }
    );

    await User.deleteOne({
      _id: user._id
    });

    // -------------------------
    // PostgreSQL
    // -------------------------

    const postgresStatus =
      await postgresql.connect();

    printSection(
      "4. PostgreSQL Connection",
      postgresStatus
    );

    await usersMigration.up();

    await productMigration.up();

    printSection(
      "5. PostgreSQL Migrations",
      {
        usersTable:
          "created",
        productsTable:
          "created",
        ordersTable:
          "created",
        orderItemsTable:
          "created",
        reviewsTable:
          "created"
      }
    );

    const product =
      await Product.create({
        name:
          "Day 10 Test Laptop",
        description:
          "A test product created during the Day 10 database task.",
        price:
          65000,
        category:
          "Electronics",
        stock:
          10,
        imageUrl:
          "https://example.com/laptop.jpg",
        tags: [
          "laptop",
          "development"
        ]
      });

    printSection(
      "6. PostgreSQL Product Model",
      {
        id:
          product.id,
        name:
          product.name,
        price:
          product.price,
        category:
          product.category,
        stock:
          product.stock
      }
    );

    const productFromDb =
      await Product.findById(
        product.id
      );

    printSection(
      "7. PostgreSQL Query",
      productFromDb
    );

    const stats =
      await Product.getStats();

    printSection(
      "8. PostgreSQL Statistics",
      stats
    );

    const indexes =
      await postgresql.query(`
        SELECT
          indexname
        FROM
          pg_indexes
        WHERE
          tablename = 'products'
        ORDER BY
          indexname
      `);

    printSection(
      "9. PostgreSQL Indexes",
      indexes.rows
    );

    await Product.delete(
      product.id
    );

    await productMigration.down();

    await usersMigration.down();

    printSection(
      "10. Migration Rollback",
      {
        productTables:
          "dropped",
        usersTable:
          "dropped"
      }
    );

    printSection(
      "DAY 10 RESULT",
      {
        mongodb:
          "PASSED",
        mongodbModel:
          "PASSED",
        jwt:
          "PASSED",
        postgresql:
          "PASSED",
        migrations:
          "PASSED",
        postgresModel:
          "PASSED",
        queries:
          "PASSED",
        indexes:
          "PASSED",
        rollback:
          "PASSED"
      }
    );
  } catch (error) {
    console.error(
      "\nDAY 10 TEST FAILED"
    );

    console.error(
      error
    );

    process.exitCode = 1;
  } finally {
    await mongo.disconnect()
      .catch(() => {});

    await postgresql
      .disconnect()
      .catch(() => {});
  }
}

main();