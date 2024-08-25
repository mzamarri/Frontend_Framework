CREATE OR REPLACE FUNCTION add_to_orders_and_return_id(_order json) RETURNS int AS $$
    WITH order_results (address, total_price, items) AS (
        SELECT * FROM json_to_record(_order)
        AS (address text, "totalPrice" float, items json)
    ), inserted_order AS (
        INSERT INTO orders (address, total_price) SELECT address, total_price
        FROM order_results RETURNING order_id
    ), items AS (
        SELECT * FROM json_to_recordset((SELECT items FROM order_results))
        AS (catalog_id int, amount int)
    )
    INSERT INTO order_items (order_id, catalog_id, quantity) SELECT io.order_id, i.catalog_id, i.amount 
    FROM items i, inserted_order io RETURNING order_id
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION add_to_catalog_and_return(items json) 
RETURNS TABLE (
    catalog_id int,
    name text,
    price float,
    "imageSrc" text,
    description text
)
AS $$
   CALL add_to_catalog(items)
   SELECT * FROM catalog
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION add_to_catalog_and_return_row(item json)
RETURNS TABLE (
    catalog_id int,
    name text, 
    price float,
    image_src text,
    description text
)
AS $$
    INSERT INTO catalog (name, price, image_src, description) 
    SELECT name, price, "imageSrc" AS image_src, description FROM json_to_record(item)
    AS (name text, price float, "imageSrc" text, description text)
    RETURNING *
$$ LANGUAGE SQL;

