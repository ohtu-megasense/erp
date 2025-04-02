DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS category;

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
    item_shape JSONB
);

CREATE TABLE IF NOT EXISTS item (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES category (id) ON DELETE CASCADE,
    item_data JSONB
);
