CREATE TABLE IF NOT EXISTS docker_checks (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO docker_checks (message)
VALUES (
    'Day 16 PostgreSQL initialization completed'
);