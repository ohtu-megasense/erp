CREATE TABLE IF NOT EXISTS items(
    id SERIAL PRIMARY KEY,
    item_name TEXT
);

CREATE TABLE IF NOT EXISTS value_types(
    value_id SERIAL PRIMARY KEY,
    value_name TEXT,
    value_type TEXT
);

CREATE TABLE IF NOT EXISTS values(
    item_id INT REFERENCES items(id),
    value_id INT REFERENCES value_types(value_id)
);


CREATE TABLE IF NOT EXISTS app_metrics (
    id SERIAL PRIMARY KEY,
    app_name VARCHAR(50),
    platform VARCHAR(10), -- 'iOS' or 'Android'
    downloads INT DEFAULT 0,
    app_rating DECIMAL(3, 2),
    active_subscriptions INT DEFAULT 0,
    revenue DECIMAL(10,2),
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_sensors (
    id SERIAL PRIMARY KEY,
    sensor_name VARCHAR(50),
    sensor_location VARCHAR(50),
    sensor_status VARCHAR(20),
    last_updated TIMESTAMP DEFAULT NOW()
)