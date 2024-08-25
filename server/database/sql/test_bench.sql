-- SELECT EXISTS (
--     SELECT catalog_id FROM catalog
--     WHERE catalog_id = 75
-- );

-- SELECT EXISTS (
--     SELECT catalog_id FROM catalog
--     WHERE catalog_id = 80
-- );

-- SELECT key FROM json_each('{"a": 12, "b": null, "c": "Hello World!"}'::json);

-- DO $$
-- DECLARE
--     _key text;
--     _value json;
-- BEGIN
--     FOR _key, _value IN SELECT * FROM json_each('{"a": 12, "b": null, "c": "Hello World!"}'::json) LOOP
--         RAISE NOTICE 'key: %', _key;
--         RAISE NOTICE 'value: %', _value;
--     END LOOP;
-- END $$ LANGUAGE plpgsql;

-- CALL update_order_history(1, '{
--     "items": {
--         "ADD": [
--             {
--                 "catalog_id": 2,
--                 "amount": 111
--             },
--             {
--                 "catalog_id": 3,
--                 "amount": 123
--             }
--         ]
--     }
-- }');

-- Testing update_order_history procedure

-- CALL update_order_history(1, '{
--     "items": {
--         "UPDATE": [
--             {
--                 "catalog_id": 1,
--                 "amount": 111
--             }, {
--                 "catalog_id": 2,
--                 "amount": 222
--             }, {
--                 "catalog_id": 3,
--                 "amount": 333
--             }
--         ]
--     }
-- }');


-- WITH results (name, price, image_src, description) AS (
--     SELECT * FROM json_to_recordset(
--         '[
--             {
--                 "name": "Xbox",
--                 "price": 1000.00,
--                 "image_src": "#",
--                 "description": "Description of xbox"
--             }, 
--             {
--                 "name": "PS",
--                 "price": 500.00,
--                 "image_src": "#",
--                 "description": "Description of PS"
--             },
--             {
--                 "name": "Nintendo",
--                 "price": 499.99,
--                 "image_src": "#",
--                 "description": "Description of Nintendo"
--             },
--             {
--                 "name": "Game Boy",
--                 "price": 123.456,
--                 "image_src": "#",
--                 "description": "Description of Game Boy"
--             },
--             {
--                 "name": "Mike",
--                 "price": 123.456,
--                 "image_src": "#",
--                 "description": "Description of Mike"
--             }
--         ]'
--     ) 
--     AS (name text, price float, image_src text, description text)
-- ) INSERT INTO catalog (name, price, image_src, description) SELECT * FROM results;

-- CALL clear_tables();
-- CALL create_tables();

-- SELECT * FROM json_to_recordset(
--     '[
--         {
--             "name": "Item 1",
--             "price": 9.99,
--             "imageSrc": "#",
--             "description": "Item 1 description"
--         },
--         {
--             "name": "Item 2",
--             "price": 19.99,
--             "imageSrc": "#",
--             "description": "Item 2 description"
--         },
--         {
--             "name": "Item 3",
--             "price": 29.99,
--             "imageSrc": "#",
--             "description": "Item 3 description"
--         }
--     ]'
-- ) 
-- AS (name text, price float, "imageSrc" text, description text);


-- SELECT add_to_orders_and_return_id('
--     {
--         "address": "619 avenue",
--         "totalPrice": 199.99,
--         "items": [
--             {
--                 "catalog_id": 1,
--                 "amount": 3
--             },
--             {
--                 "catalog_id": 5,
--                 "amount": 6
--             },
--             {
--                 "catalog_id": 10,
--                 "amount": 9
--             }
--         ]
--     }
-- ');

-- SELECT * FROM catalog;

-- CALL update_catalog(
--     '[
--         {
--             "catalog_id": 1,
--             "name": "Test Item 1",
--             "price": 14.99,
--             "imageSrc": "Test link",
--             "description": "Test description"
--         },
--         {
--             "catalog_id": 2,
--             "name": "Test Item 2",
--             "price": 29.99,
--             "imageSrc": "Test link",
--             "description": "Test description"
--         },
--         {
--             "catalog_id": 3,
--             "name": "Test Item 3",
--             "price": 44.99,
--             "imageSrc": "Test link",
--             "description": "Test description"
--         },
--         {
--             "catalog_id": 4,
--             "name": "Test Item 4",
--             "price": 59.99,
--             "imageSrc": "Test link",
--             "description": "Test description"
--         }
--     ]'
-- );

-- SELECT * FROM get_catalog() WHERE "catalogId" IN (1,2,3,4,5);
-- SELECT * FROM orders;
-- SELECT * FROM order_items ORDER BY order_id, catalog_id;

CALL clear_tables();
CALL create_tables();

CALL add_to_catalog('[
    {
        "name": "item 1",
        "price": 24.99,
        "imageSrc": "#",
        "description": "Item 1 description" 
    },
    {
        "name": "item 2",
        "price": 49.99,
        "imageSrc": "#",
        "description": "Item 2 description" 
    },
    {
        "name": "item 3",
        "price": 74.99,
        "imageSrc": "#",
        "description": "Item 3 description" 
    },
    {
        "name": "item 4",
        "price": 99.99,
        "imageSrc": "#",
        "description": "Item 4 description" 
    },
    {
        "name": "item 5",
        "price": 124.99,
        "imageSrc": "#",
        "description": "Item 5 description" 
    },
    {
        "name": "item 6",
        "price": 149.99,
        "imageSrc": "#",
        "description": "Item 6 description" 
    },
    {
        "name": "item 7",
        "price": 174.99,
        "imageSrc": "#",
        "description": "Item 7 description" 
    },
    {
        "name": "item 8",
        "price": 199.99,
        "imageSrc": "#",
        "description": "Item 8 description" 
    }
]');

CALL add_to_orders(
    '{
        "address": "123 street",
        "totalPrice": 199.99,
        "items": [
            {
                "catalogId": 1,
                "name": "Item 1",
                "amount": 12
            },
            {
                "catalogId": 2,
                "name": "Item 2",
                "amount": 34
            },
            {
                "catalogId": 3,
                "name": "Item 3",
                "amount": 15
            },
            {
                "catalogId": 4,
                "name": "Item 4",
                "amount": 43
            }
        ]
    }'
);
CALL add_to_orders(
    '{
        "address": "456 avenue",
        "totalPrice": 299.99,
        "items": [
            {
                "catalogId": 5,
                "name": "Item 5",
                "amount": 9
            },
            {
                "catalogId": 6,
                "name": "Item 6",
                "amount": 21
            },
            {
                "catalogId": 7,
                "name": "Item 7",
                "amount": 8
            },
            {
                "catalogId": 8,
                "name": "Item 8",
                "amount": 17
            }
        ]
    }'
);

-- SELECT * FROM catalog;
SELECT * FROM orders;
SELECT * FROM order_items WHERE order_id=1;

CALL update_order_history('
    {
        "orderId": 1,
        "address": "789 Way",
        "totalPrice": 499.99,
        "items": {
            "ADD": [
                {
                    "catalogId": 5,
                    "amount": 5,
                    "name": "xbox"
                },
                {
                    "catalogId": 6,
                    "amount": 11,
                    "name": "ps"
                }
            ],
            "REMOVE": [
                {
                    "catalogId": 1,
                    "amount": 5,
                    "name": "chocolate"
                },
                {
                    "catalogId": 2,
                    "amount": 11,
                    "name": "vanilla"
                }
            ],
            "UPDATE": [
                {
                    "catalogId": 3,
                    "amount": 1,
                    "name": "muay thai"
                },
                {
                    "catalogId": 4,
                    "amount": 2,
                    "name": "boxing"
                }
            ]
        }
    }
');

SELECT * FROM orders;
SELECT * FROM order_items WHERE order_id=1;