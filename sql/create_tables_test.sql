CREATE TABLE IF NOT EXISTS catalog (
    catalog_id varchar(12) PRIMARY KEY,
    name varchar(255) NOT NULL,
    price float NOT NULL,
    image_src varchar(255),
    description varchar(255)
);

CREATE TABLE IF NOT EXISTS order_history (
    order_id char(12) PRIMARY KEY,
    catalog_id char(12) NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (catalog_id) REFERENCES catalog(catalog_id)
);