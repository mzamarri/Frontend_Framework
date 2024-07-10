CREATE OR REPLACE PROCEDURE add_to_catalog(cid TEXT, cname TEXT, cprice FLOAT, cimage_src TEXT, cdescription TEXT) AS $$
BEGIN
    INSERT INTO catalog(catalog_id, name, price, image_src, description) 
    VALUES (cid::varchar(12) ,cname, cprice, cimage_src, cdescription);
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_to_order_items(oid TEXT, cid TEXT, quantity INT) AS $$
BEGIN
    INSERT INTO order_items(order_id, catalog_id, quantity) 
    VALUES (oid::varchar(12), cid::varchar(12), quantity);
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE clear_tables() AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE';
    END LOOP;
END
$$ LANGUAGE plpgsql;

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