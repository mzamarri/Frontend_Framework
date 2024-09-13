SELECT * FROM cart;

CALL add_to_cart('LAKsvAj857cFWfdpS7hLeDGJWCXg5Z1V', '
    [
        {
            "catalogId": 2,
            "amount": 5
        },
        {
            "catalogId": 4,
            "amount": 8
        },
        {
            "catalogId": 8,
            "amount": 2
        }
    ]
');

SELECT * FROM cart;