DROP TABLE item;
DROP TABLE category;

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    item_shape JSON,
    item JSON[]
);

CREATE TABLE IF NOT EXISTS item (
    id INT PRIMARY KEY REFERENCES category (id),
    item_data JSON
);
