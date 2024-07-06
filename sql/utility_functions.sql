CREATE OR REPLACE FUNCTION  print_msg(msg TEXT DEFAULT 'Hello World!', OUT output_value integer) AS $$
<<outer_block>>
DECLARE 
    outer_msg TEXT := 'outer block';
BEGIN
    RAISE NOTICE 'message printed from %: %', outer_msg, msg;
    <<inner_block>>
    DECLARE
        inner_msg TEXT := 'inner block';
    BEGIN
        RAISE NOTICE 'message printed from %: %', inner_msg, msg;
    END inner_block;

    output_value := 1;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION if_else_func(bool_var BOOLEAN) RETURNS TEXT AS $$
DECLARE 
    isTrue TEXT;
BEGIN
    IF bool_var THEN
        isTrue := 'true';
    ELSE
        isTrue := 'false';
    END IF;
    RAISE NOTICE 'The value of isTrue is %', isTrue;
    RETURN isTrue;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION for_loop_msg() RETURNS VOID AS $$
DECLARE
    n INT  := 5;
BEGIN
    FOR i IN 1..n LOOP
        RAISE NOTICE 'The value of i is %', i;
    END LOOP;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_to_catalog(cid TEXT, cname TEXT, cprice FLOAT, cimage_src TEXT, cdescription TEXT) AS $$
BEGIN
    INSERT INTO catalog(catalog_id, name, price, image_src, description) 
    VALUES (cid::varchar(12) ,cname, cprice, cimage_src, cdescription);
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE populate_catalog(n INT DEFAULT 15) AS $$
BEGIN
    FOR i IN 1..n LOOP
        CALL add_to_catalog(
            i::TEXT,
            'Item' || i::TEXT,
            i * 10.0,
            'test url',
            'Description for item ' || i::TEXT
        );
    END LOOP;
END 
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_to_order_history(oid TEXT, total_price FLOAT) AS $$
BEGIN
    INSERT INTO order_history(order_id, total_price) 
    VALUES (oid::varchar(12), total_price);
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
