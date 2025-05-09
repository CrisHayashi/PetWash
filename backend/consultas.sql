-- INSERT INTO tutors (name, email, phone) values ('exemplo', 'ex@doe.com', '123456789');
-- DROP TABLE pets;
-- SELECT * FROM tutors;
-- SELECT * FROM pets;
-- CREATE TABLE IF NOT EXISTS products (
--            id INTEGER PRIMARY KEY AUTOINCREMENT,
--            name VARCHAR(150) NOT NULL,
--            price INTEGER NOT NULL,
--            category VARCHAR(150) NOT NULL,
--            stock INTEGER NOT NULL
--        )
-- INSERT INTO pets (name, species, age, tutorId) values ('Pet1', 'Animal1', 2, 1);
-- INSERT INTO order_products (orderId, productId, quantidade) values (1, 1, 1);
-- SELECT 
--     orders.id AS idPedido,
--     tutors.name AS tutorName,
--     pets.name AS petName,
--     orders.total AS total,
--     orders.status AS status,
--     GROUP_CONCAT(products.name) AS productNames
-- FROM
--     orders
-- JOIN tutors ON tutors.id = orders.tutorId
-- JOIN pets ON pets.id = orders.petId
-- JOIN order_products ON order_products.orderId = orders.id
-- JOIN products ON products.id = order_products.productId;

DROP TABLE IF EXISTS order_products;
DROP TABLE IF EXISTS order_services;
DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS services;
-- DROP TABLE IF EXISTS pets;
-- DROP TABLE IF EXISTS tutors;
