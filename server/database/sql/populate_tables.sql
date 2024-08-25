DO $$
DECLARE
    n_cat int := 10;
    n_o int := 8;
BEGIN
    FOR i IN  1..n_cat LOOP
        INSERT INTO catalog (name, price, image_src, description) VALUES ('name' || i, 10.00 * i, '#', 'test description' || i);
    END LOOP;

    FOR i IN  1..n_o LOOP
        INSERT INTO orders (address, total_price) VALUES ('address' || i, 150.00 * i);
        INSERT INTO order_items VALUES (currval('orders_order_id_seq'), i, 2 * i);
        INSERT INTO order_items VALUES (currval('orders_order_id_seq'), i + 1, 3 * i);
        INSERT INTO order_items VALUES (currval('orders_order_id_seq'), i + 2, 4 * i);
    END LOOP;
END $$ LANGUAGE plpgsql;

SELECT * FROM order_history;