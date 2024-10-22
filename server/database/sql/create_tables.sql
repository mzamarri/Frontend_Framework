-- Create database tables
CREATE OR REPLACE PROCEDURE create_tables() AS $$
    CREATE TABLE IF NOT EXISTS "catalog" (
        catalog_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name varchar(255) NOT NULL,
        price float NOT NULL,
        image_src varchar(255) DEFAULT '',
        description varchar(255)
    );

    CREATE TABLE IF NOT EXISTS "orders" (
        order_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id text,
        address varchar(255),
        total_price float NOT NULL,
        purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "order_items" (
        order_id int,
        catalog_id int,
        quantity int NOT NULL,
        PRIMARY KEY (order_id, catalog_id),
        FOREIGN KEY (order_id) REFERENCES "orders",
        FOREIGN KEY (catalog_id) REFERENCES "catalog" 
    );

    CREATE OR REPLACE VIEW order_history AS
    SELECT
        o.order_id,
        o.user_id,
        o.address, 
        o.purchase_date, 
        o.total_price,
        json_agg(json_object(
                'catalogId': c.catalog_id,
                'name': c.name,
                'price': c.price,
                'imageSrc': c.image_src,
                'description': c.description,
                'amount': oi.quantity
        ) ORDER BY c.catalog_id) AS "items"
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.order_id
    JOIN "catalog" c ON c.catalog_id = oi.catalog_id
    GROUP BY o.order_id ORDER BY o.order_id;

    CREATE TABLE IF NOT EXISTS "cart" (
        user_id text,
        catalog_id int,
        quantity int,
        PRIMARY KEY (user_id, catalog_id)
    );
$$ LANGUAGE SQL;