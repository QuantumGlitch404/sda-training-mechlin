const postgresql =
  require(
    "../database/postgresql"
  );

class Product {
  constructor() {
    this.tableName =
      "products";

    this.allowedSortFields = [
      "created_at",
      "updated_at",
      "name",
      "price",
      "stock"
    ];
  }

  async create(
    productData
  ) {
    const {
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      tags = []
    } = productData;

    const query = `
      INSERT INTO products
        (
          name,
          description,
          price,
          category,
          stock,
          image_url,
          tags,
          created_at,
          updated_at
        )
      VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          NOW(),
          NOW()
        )
      RETURNING *
    `;

    const values = [
      name,
      description,
      price,
      category,
      stock,
      imageUrl || null,
      JSON.stringify(tags)
    ];

    const result =
      await postgresql.query(
        query,
        values
      );

    return result.rows[0];
  }

  async findById(id) {
    const query = `
      SELECT
        p.*,
        COUNT(DISTINCT o.id)
          AS order_count,
        COALESCE(
          AVG(r.rating),
          0
        ) AS average_rating
      FROM products p

      LEFT JOIN order_items oi
        ON p.id = oi.product_id

      LEFT JOIN orders o
        ON oi.order_id = o.id

      LEFT JOIN reviews r
        ON p.id = r.product_id

      WHERE p.id = $1

      GROUP BY p.id
    `;

    const result =
      await postgresql.query(
        query,
        [id]
      );

    return result.rows[0];
  }

  async findAll(
    filters = {}
  ) {
    let query = `
      SELECT
        p.*,
        COUNT(DISTINCT o.id)
          AS order_count,
        COALESCE(
          AVG(r.rating),
          0
        ) AS average_rating
      FROM products p

      LEFT JOIN order_items oi
        ON p.id = oi.product_id

      LEFT JOIN orders o
        ON oi.order_id = o.id

      LEFT JOIN reviews r
        ON p.id = r.product_id
    `;

    const conditions = [];
    const values = [];
    let paramCount = 0;

    if (filters.category) {
      paramCount++;

      conditions.push(
        `p.category = $${paramCount}`
      );

      values.push(
        filters.category
      );
    }

    if (
      filters.minPrice !==
      undefined
    ) {
      paramCount++;

      conditions.push(
        `p.price >= $${paramCount}`
      );

      values.push(
        filters.minPrice
      );
    }

    if (
      filters.maxPrice !==
      undefined
    ) {
      paramCount++;

      conditions.push(
        `p.price <= $${paramCount}`
      );

      values.push(
        filters.maxPrice
      );
    }

    if (filters.search) {
      paramCount++;

      conditions.push(
        `(p.name ILIKE $${paramCount}
          OR p.description ILIKE $${paramCount})`
      );

      values.push(
        `%${filters.search}%`
      );
    }

    if (
      conditions.length
    ) {
      query +=
        ` WHERE ${conditions.join(
          " AND "
        )}`;
    }

    query +=
      " GROUP BY p.id";

    let sortField =
      "created_at";

    if (
      filters.sortBy &&
      this.allowedSortFields.includes(
        filters.sortBy
      )
    ) {
      sortField =
        filters.sortBy;
    }

    const sortOrder =
      filters.sortOrder ===
      "ASC"
        ? "ASC"
        : "DESC";

    query +=
      ` ORDER BY p.${sortField} ${sortOrder}`;

    if (
      filters.limit
    ) {
      paramCount++;

      query +=
        ` LIMIT $${paramCount}`;

      values.push(
        filters.limit
      );
    }

    if (
      filters.offset
    ) {
      paramCount++;

      query +=
        ` OFFSET $${paramCount}`;

      values.push(
        filters.offset
      );
    }

    const result =
      await postgresql.query(
        query,
        values
      );

    return result.rows;
  }

  async update(
    id,
    updateData
  ) {
    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "stock",
      "image_url",
      "tags"
    ];

    const fields = [];
    const values = [];
    let paramCount = 0;

    for (
      const key of allowedFields
    ) {
      if (
        updateData[key] !==
        undefined
      ) {
        paramCount++;

        fields.push(
          `${key} = $${paramCount}`
        );

        values.push(
          updateData[key]
        );
      }
    }

    if (!fields.length) {
      throw new Error(
        "No fields to update"
      );
    }

    paramCount++;

    values.push(id);

    const query = `
      UPDATE products
      SET
        ${fields.join(", ")},
        updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result =
      await postgresql.query(
        query,
        values
      );

    return result.rows[0];
  }

  async delete(id) {
    const result =
      await postgresql.query(
        `
          DELETE FROM products
          WHERE id = $1
          RETURNING *
        `,
        [id]
      );

    return result.rows[0];
  }

  async getStats() {
    const result =
      await postgresql.query(`
        SELECT
          COUNT(*) AS total_products,
          AVG(price) AS average_price,
          MIN(price) AS min_price,
          MAX(price) AS max_price,
          SUM(stock) AS total_stock
        FROM products
      `);

    return result.rows[0];
  }

  async getCategoryStats() {
    const result =
      await postgresql.query(`
        SELECT
          category,
          COUNT(*) AS product_count,
          AVG(price) AS average_price,
          SUM(stock) AS total_stock
        FROM products
        GROUP BY category
        ORDER BY product_count DESC
      `);

    return result.rows;
  }
}

module.exports =
  new Product();