SELECT
    o.order_id, 
    o.purchase_date, 
    o.total_price,
    json_agg(json_object(
            'name': c.name,
            'price': c.price,
            'imageSrc': c.image_src,
            'description': c.description,
            'amount': oi.quantity
        )) AS "items"
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN "catalog" c ON c.catalog_id = oi.catalog_id
GROUP BY o.order_id;