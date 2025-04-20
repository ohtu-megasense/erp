DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS views CASCADE;

CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    module_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS views (
    id SERIAL PRIMARY KEY,
    module_id INT REFERENCES modules (id),
    name TEXT NOT NULL,
    filter_config JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    module_id INT REFERENCES modules (id),
    category_name TEXT NOT NULL,
    item_shape JSONB
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories (id) ON DELETE CASCADE,
    item_data JSONB
);

INSERT INTO modules (module_name) VALUES ('crm');
INSERT INTO modules (module_name) VALUES ('inventory');
INSERT INTO modules (module_name) VALUES ('ride_sharing');
