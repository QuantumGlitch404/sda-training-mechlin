const postgresql =
  require(
    "../database/postgresql"
  );

async function up() {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(12, 2) NOT NULL
        CHECK (price >= 0),
      category VARCHAR(50) NOT NULL,
      stock INTEGER NOT NULL
        CHECK (stock >= 0),
      image_url VARCHAR(500),
      tags JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      status VARCHAR(30) DEFAULT 'created',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),

      CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID NOT NULL,
      product_id UUID NOT NULL,
      quantity INTEGER NOT NULL
        CHECK (quantity > 0),

      CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL,
      user_id UUID,
      rating INTEGER NOT NULL
        CHECK (
          rating >= 1 AND
          rating <= 5
        ),
      review_text TEXT,
      created_at TIMESTAMP DEFAULT NOW(),

      CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_category
      ON products(category);

    CREATE INDEX IF NOT EXISTS idx_products_price
      ON products(price);

    CREATE INDEX IF NOT EXISTS idx_products_created_at
      ON products(created_at);

    CREATE INDEX IF NOT EXISTS idx_orders_user_id
      ON orders(user_id);

    CREATE INDEX IF NOT EXISTS idx_order_items_product_id
      ON order_items(product_id);

    CREATE INDEX IF NOT EXISTS idx_reviews_product_id
      ON reviews(product_id);
  `;

  await postgresql.query(query);

  console.log(
    "Product and related tables created successfully"
  );
}

async function down() {
  await postgresql.query(`
    DROP TABLE IF EXISTS reviews CASCADE;
    DROP TABLE IF EXISTS order_items CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
  `);

  console.log(
    "Product-related tables dropped successfully"
  );
}

module.exports = {
  up,
  down
};