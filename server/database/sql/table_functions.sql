-- This file contains functions that will be used to process json request

--Catalog

CREATE OR REPLACE PROCEDURE add_to_catalog(product json) AS $$
    WITH results (name, price, image_src, description) AS (
        SELECT * FROM json_to_recordset(product) 
        AS (name text, price float, "imageSrc" text, description text)
    ) 
    INSERT INTO catalog (name, price, image_src, description) SELECT * FROM results
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE update_catalog(product json) AS $$
    WITH results (catalog_id, name, price, image_src, description) AS (
        SELECT * FROM json_to_recordset(product) 
        AS ("catalogId" int, name text, price float, "imageSrc" text, description text)
    )
    UPDATE catalog AS c SET 
        name = res.name, 
        price = res.price, 
        image_src = res.image_src, 
        description = res.description
    FROM results res WHERE c.catalog_id = res.catalog_id
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_catalog()
RETURNS TABLE (
    "catalogId" int,
    name text,
    price float,
    "imageSrc" text,
    description text
)
AS $$
    SELECT catalog_id, name, price, image_src, description FROM catalog
$$ LANGUAGE SQL; 

-- Orders

CREATE OR REPLACE PROCEDURE add_to_order_items(items json) AS $$
    WITH results (order_id, catalog_id, quantity) AS (
        SELECT * FROM json_to_recordset(items)
        AS (order_id int, catalog_id int, amount int)
    )
    INSERT INTO order_items SELECT * FROM results
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE add_to_orders(_order json) AS $$
    WITH order_results (address, total_price, items) AS (
        SELECT * FROM json_to_record(_order)
        AS (address text, "totalPrice" float, items json)
    ), inserted_order AS (
        INSERT INTO orders (address, total_price) SELECT address, total_price
        FROM order_results RETURNING order_id
    ), items (catalog_id, amount) AS (
        SELECT * FROM json_to_recordset((SELECT items FROM order_results))
        AS ("catalogId" int, amount int)
    )
    INSERT INTO order_items (order_id, catalog_id, quantity) SELECT io.order_id, i.catalog_id, i.amount 
    FROM items i, inserted_order io 
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_order_history() 
RETURNS TABLE (
    "orderId" int,
    address text,
    "totalPrice" float,
    items json
)
AS $$
    WITH orders AS (
        SELECT * FROM order_history
    )
    SELECT order_id AS "orderId", address, total_price AS "totalPrice", items FROM order_history;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_order_history(limit_amount int)
RETURNS TABLE (
    "orderId" int,
    address text,
    "totalPrice" float,
    items json
)
AS $$
    SELECT * FROM get_order_history() LIMIT limit_amount;
$$ LANGUAGE SQL;

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

CREATE OR REPLACE PROCEDURE update_order_history(_order json) AS $$
DECLARE
    _order_id int;
    _address text;
    _total_price float;
    _items json;

    query_operation text;
    query_items json;
    item_key text;
    item_value record;
BEGIN
    WITH order_results (order_id, address, total_price, items) AS (
        SELECT * FROM json_to_record(_order) 
        AS ("orderId" int, address text, "totalPrice" float, "updatedItems" json)
    )
    SELECT * INTO _order_id, _address, _total_price, _items FROM order_results ores;
    UPDATE orders SET address=_address, total_price=_total_price WHERE order_id=_order_id;

    FOR query_operation, query_items IN SELECT * FROM json_each(_items) LOOP
        CASE query_operation
            WHEN 'add' THEN
                WITH add_items (catalog_id, amount) AS (
                    SELECT * FROM json_to_recordset(query_items)
                    AS ("catalogId" int, amount int)
                )
                INSERT INTO order_items (order_id, catalog_id, quantity)
                SELECT _order_id, ai.catalog_id, ai.amount FROM add_items ai;
            WHEN 'remove' THEN
                WITH remove_items (catalog_id) AS (
                    SELECT * FROM json_to_recordset(query_items)
                    AS ("catalogId" int)
                )
                DELETE FROM order_items oi USING remove_items ri 
                WHERE oi.order_id=_order_id AND oi.catalog_id=ri.catalog_id;
            WHEN 'update' THEN
                WITH update_items (catalog_id, amount) AS (
                    SELECT * FROM json_to_recordset(query_items)
                    AS ("catalogId" int, amount int)
                )
                UPDATE order_items oi SET quantity=ui.amount FROM update_items ui
                WHERE oi.order_id=_order_id AND oi.catalog_id=ui.catalog_id;
        END CASE;
    END LOOP;
END $$ LANGUAGE plpgsql;

-- Cart

CREATE OR REPLACE FUNCTION get_cart(user_id text) 
RETURNS TABLE (
    "cart" json
) AS $$
    SELECT json_arrayagg(json_object(
        'catalogId': c.catalog_id,
        'name': cat.name,
        'price': cat.price,
        'imageSrc': cat.image_src,
        'description': cat.description,
        'amount': c.quantity
    ))
    FROM cart c JOIN catalog cat ON c.catalog_id = cat.catalog_id WHERE c.user_id = get_cart.user_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE add_to_cart(user_id text, _items json) AS $$
DECLARE
    i RECORD; --item variable
    item_exist boolean := false;
BEGIN
    FOR i IN 
        SELECT
            "catalogId" AS catalog_id,
            "addAmount" as amount  
        FROM json_to_recordset(_items) 
        AS ("catalogId" int, "addAmount" int)
    LOOP
        SELECT EXISTS ( 
            SELECT * FROM cart c
            WHERE c.user_id = add_to_cart.user_id AND c.catalog_id = i.catalog_id
        ) INTO item_exist;
        IF NOT item_exist THEN
            INSERT INTO cart (user_id, catalog_id, quantity) 
            SELECT add_to_cart.user_id, i.catalog_id, i.amount;
        ELSIF item_exist THEN
            UPDATE cart c SET quantity = quantity + i.amount 
            WHERE c.user_id = add_to_cart.user_id AND c.catalog_id = i.catalog_id;
        ELSE
            RAISE EXCEPTION 'item_exist value is neither true or false';
        END IF;
    END LOOP;
END $$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE update_cart(user_id text, _items json) AS $$
    WITH items (catalog_id, updated_amount) AS (
        SELECT * FROM json_to_recordset(_items) 
        AS ("catalogId" int, amount int)
    )
    UPDATE cart c SET quantity = items.updated_amount FROM items
    WHERE c.user_id = update_cart.user_id AND c.catalog_id = items.catalog_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE delete_from_cart(user_id text, _items json) AS $$
    WITH items (arr_values) AS (
        SELECT array_agg(text_values::int) FROM json_array_elements_text(_items) AS text_values
    )
    DELETE FROM cart c USING items
    WHERE c.user_id = delete_from_cart.user_id AND c.catalog_id = ANY (items.arr_values);
$$ LANGUAGE SQL;