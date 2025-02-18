

/*
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
*/


CREATE TABLE inventory_module (
    id SERIAL PRIMARY KEY,
    inventory_item VARCHAR(50)
)