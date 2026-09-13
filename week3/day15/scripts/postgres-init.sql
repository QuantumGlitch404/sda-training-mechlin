CREATE TABLE IF NOT EXISTS environment_checks (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO environment_checks (message)
VALUES ('Day 15 PostgreSQL initialization completed');