-- Active: 1681759143027@@127.0.0.1@3306
CREATE TABLE users (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL
);

INSERT INTO users (id, email, password)
VALUES ("1", "astrodev@email.com", "astrodev123"),
	("2", "fulana@email.com", "fulana2001"),
	("3", "ciclano@email.com", "ciclano99");

SELECT * from users;

CREATE TABLE products (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
	price REAL NOT NULL,
	category TEXT NOT NULL
);

INSERT INTO products (id, name, price, category)
VALUES ("1", "Monitor 17", 250, "Eletrônicos"),
    ("2", "Mouse", 80, "Eletrônicos"),
    ("3", "Teclado", 150, "Eletrônicos"),
    ("4", "Balde de lixo", 25, "Acessórios"),
    ("5", "Cabo USB", 2, "Acessórios");

SELECT * from products;

-- Deletar tabela
-- DROP TABLE users;

-- Deletar item
-- DELETE FROM users WHERE id = 3;

-- Editar item
-- UPDATE users SET
-- 	email = "fulana@outro-email.com",
-- 	password = "fulana00"
-- WHERE id = 2; 

-- Selecionar somente algumas colunas
-- SELECT ( name, email ) FROM users;

-- Verificar a estrutura da tabela
-- PRAGMA table_info('users');

-- Get All Users
-- retorna todos os usuários cadastrados
SELECT * from users;

-- Get All Products
-- retorna todos os produtos cadastrados
SELECT * from products;

-- Search Product by name
-- crie um termo de busca, por exemplo "monitor"
-- retorna o resultado baseado no termo de busca
SELECT * from products WHERE name LIKE "%Monitor%";

-- Create User
-- crie um novo usuário
-- insere o item mockado na tabela users
INSERT INTO users (id, email, password)
VALUES ("999", "leotheras@email.com", "1234");

-- Create Product
-- crie um novo produto
-- insere o item mockado na tabela products
INSERT INTO products (id, name, price, category)
VALUES ("999", "Meia suja", 1, "Roupas e calçados");

-- Get Products by id
-- busca de produtos por id
SELECT * from products WHERE id = '1';

-- Delete User by id
-- deleção de user por id
DELETE FROM users WHERE id = '999';

-- Delete Product by id
-- deleção de produto por id
DELETE FROM products WHERE id = '999';

-- Edit User by id
-- edição de user por id
UPDATE users SET
	email = "fulana@outro-email.com",
	password = "fulana00"
WHERE id = 2; 

-- Edit Product by id
-- edição de produto por id
UPDATE products SET
    name = "Cabo USB-C"
WHERE id = 5; 

-- Copie as queries do exercício 1 e refatore-as
-- Get All Users
-- retorna o resultado ordenado pela coluna email em ordem crescente
SELECT * from users ORDER BY email ASC;

-- Get All Products versão 1
-- retorna o resultado ordenado pela coluna price em ordem crescente
-- limite o resultado em 20 iniciando pelo primeiro item
SELECT * from products ORDER BY price ASC LIMIT 20;

-- Get All Products versão 2
-- seleção de um intervalo de preços, por exemplo entre 100.00 e 300.00
-- retorna os produtos com preços dentro do intervalo definido em ordem crescente
SELECT * from products WHERE price <= 200 AND price >= 50 ORDER BY price ASC LIMIT 20;

-- nome da tabela: purchases
-- colunas da tabela:
-- id (TEXT, PK, único e obrigatório)
-- total_price (REAL e obrigatório)
-- paid (INTEGER e obrigatório)
-- created_at (TEXT e opcional)
-- buyer_id (TEXT, obrigatório e FK = referencia a coluna id da tabela users)
CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

SELECT * from purchases;
-- a) Crie dois pedidos para cada usuário cadastrado
-- No mínimo 4 no total (ou seja, pelo menos 2 usuários diferentes) e devem iniciar com a data de entrega nula.
INSERT into purchases (id, total_price, paid, delivered_at, buyer_id)
VALUES ("001", 100, 0, NULL, "1"),
    ("002", 150, 0, NULL, "1"),
    ("003", 150, 0, NULL, "2"),
    ("004", 150, 0, NULL, "2");

-- b) Edite o status da data de entrega de um pedido
-- Simule que o pedido foi entregue no exato momento da sua edição (ou seja, data atual).
UPDATE purchases SET 
delivered_at = DATETIME('now','localtime') WHERE id = "001";

-- Crie a query de consulta utilizando junção para simular um endpoint de histórico de compras de um determinado usuário.
-- Mocke um valor para a id do comprador, ela deve ser uma das que foram utilizadas no exercício 2.
SELECT * FROM purchases 
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE buyer_id = '1';

-- nome da tabela: purchases_products
-- colunas da tabela:
-- purchase_id (TEXT e obrigatório, não deve ser único)
-- product_id (TEXT e obrigatório, não deve ser único)
-- quantity (INTEGER e obrigatório, não deve ser único)
CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products.id,
    FOREIGN KEY (purchase_id) REFERENCES purchases.id
);

INSERT into purchases_products (
    VALUES ("001", '2', 2),
        ("002", '3', 3),
        ("002", '4', 1)
);

SELECT * FROM purchases_products
INNER JOIN products ON purchases_products.product_id = products.id
INNER JOIN purchases ON purchases_products.purchase_id = purchases.id