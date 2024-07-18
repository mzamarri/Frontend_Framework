CREATE OR REPLACE PROCEDURE add_to_catalog(product json) AS $$
    WITH results (name, price, imageSrc, description) AS (
        SELECT * FROM json_to_recordset(product) 
        AS (name text, price float, "imageSrc" text, description text)
    ) 
    INSERT INTO catalog (name, price, image_src, description) SELECT * FROM results
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE add_to_order_items(items json) AS $$
    WITH results (order_id, catalog_id, quantity) AS (
        SELECT * FROM json_to_recordset(items)
        AS (order_id int, catalog_id int, amount int)
    )
    INSERT INTO order_items SELECT * FROM results
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE add_to_orders(_order json) AS $$
    
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE clear_tables() AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE';
    END LOOP;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE create_tables() AS $$
    CREATE TABLE IF NOT EXISTS "catalog" (
        catalog_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name varchar(255) NOT NULL,
        price float NOT NULL,
        image_src varchar(255) DEFAULT '#',
        description varchar(255)
    );

    CREATE TABLE IF NOT EXISTS "orders" (
        order_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
$$ LANGUAGE SQL;

CREATE TYPE item_amount AS (
    catalog_id int,
    quantity int
);

CREATE TYPE order_info AS (
    total_price float,
    item_lists item_amount[]
);

CREATE OR REPLACE PROCEDURE add_to_order_history(_order order_info) AS $$
DECLARE
    item item_amount;
    _order_id int;
BEGIN
    INSERT INTO orders (total_price) VALUES (_order.total_price)
    RETURNING order_id INTO _order_id;
    RAISE NOTICE 'order_id: %', _order_id;
    RAISE NOTICE 'total price: %', _order.total_price;
    FOREACH item IN ARRAY _order.item_lists LOOP
        RAISE NOTICE 'item id: %', item.catalog_id;
        RAISE NOTICE 'item amount: %', item.quantity;
        INSERT INTO order_items VALUES (_order_id, item.catalog_id, item.quantity);
    END LOOP;
END $$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE update_order_history(order_id int, new_order json) AS $$
DECLARE
    _key text; 
    i_key text;
    _value json;
    i_value json;
    item_record record;
    cat_id text;
BEGIN
    FOR _key, _value IN SELECT * FROM json_each(new_order) LOOP
        CASE _key
            WHEN 'address' THEN
                UPDATE orders SET total_price=_value::text;
            WHEN 'items' THEN 
                FOR i_key, i_value IN SELECT * FROM json_each(_value) LOOP
                    CASE i_key
                        WHEN 'ADD' THEN
                            FOR item_record IN SELECT * FROM json_to_recordset(i_value) 
                            AS (catalog_id int, amount int) LOOP
                                INSERT INTO order_items 
                                VALUES (order_id, item_record.catalog_id, item_record.amount);
                            END LOOP;
                        WHEN 'REMOVE' THEN
                            FOR cat_id IN SELECT * FROM json_array_elements(i_value) LOOP
                                DELETE FROM order_items oi 
                                WHERE oi.order_id = update_order_history.order_id 
                                AND oi.catalog_id = cat_id::int;
                            END LOOP;
                        WHEN 'UPDATE' THEN
                            FOR item_record IN SELECT * FROM json_to_recordset(i_value) 
                            AS (catalog_id int, amount int) LOOP
                                UPDATE order_items oi SET quantity = item_record.amount 
                                WHERE oi.order_id = update_order_history.order_id 
                                AND oi.catalog_id = item_record.catalog_id;
                            END LOOP;
                    END CASE;
                END LOOP;
        END CASE;
    END LOOP;
END $$ LANGUAGE plpgsql;