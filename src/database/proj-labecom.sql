-- Active: 1681759143027@@127.0.0.1@3306
DROP TABLE users;
DROP TABLE products;
DROP TABLE purchases;
DROP TABLE purchases_products;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt TEXT DEFAULT (DATETIME('now','localtime'))
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    stock INTEGER NOT NULL,
    imageUrl TEXT NOT NULL
);

CREATE TABLE purchases (
    id string PRIMARY KEY UNIQUE,
    buyer number NOT NULL,
    totalPrice REAL NOT NULL,
    createdAt TEXT DEFAULT (DATETIME('now','localtime')),
    paid BOOLEAN DEFAULT 0,
    FOREIGN KEY (buyer) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);