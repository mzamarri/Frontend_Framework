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

CREATE OR REPLACE PROCEDURE add_to_order_history(address varchar(255), total_price float) AS $$
    INSERT INTO orders ("address", "total_price") VALUES (address, total_price);
$$ LANGUAGE SQL;