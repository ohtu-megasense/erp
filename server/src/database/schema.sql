CREATE TABLE inventory(
    id SERIAL PRIMARY KEY,
    item_name TEXT,
    amount INT,
    item_location TEXT,
    cost INT
);