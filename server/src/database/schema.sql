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


CREATE TABLE app_metrics (
    id SERIAL PRIMARY KEY,
    app_name VARCHAR(50),
    platform VARCHAR(10), -- 'iOS' or 'Android'
    downloads INT DEFAULT 0,
    active_subscriptions INT DEFAULT 0,
    revenue DECIMAL(10,2),
    last_updated TIMESTAMP DEFAULT NOW()
);


