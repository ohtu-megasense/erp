CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    item_name TEXT
);

CREATE TABLE value_types(
    value_id SERIAL PRIMARY KEY,
    value_name TEXT,
    value_type TEXT
);

CREATE TABLE values(
    item_id INT REFERENCES items(id),
    value_id INT REFERENCES value_types(value_id)
);