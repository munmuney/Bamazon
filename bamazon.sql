CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
	id INT AUTO_INCREMENT NOT NULL,
	productName VARCHAR(100) NOT NULL,
    departmentName VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    stockQuantity INT,
	PRIMARY KEY(id)
);

ALTER TABLE products ADD productSales decimal(10,2) NOT NULL;


INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales)
VALUES (1, "ISEHAN Kiss Me Eyeliner", "Beauty", 13.8, 5, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales)
VALUES (2, "Shin Ramyun", "Food", 2.5, 1000, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales) 
VALUES (3, "Cards Against Humanity", "Games", 25, 69, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales) 
VALUES (4, "Whey Protein Powder", "Food", 55.08, 14, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales)
VALUES (5, "Innisfree Sheet Mask x16", "Beauty", 16, 200, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales) 
VALUES (6, "Jordan Retro 11", "Shoes", 423.5, 1, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales) 
VALUES (7, "Trumpet Sleeve Dress" , "Clothes", 17.99, 15, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales) 
VALUES (8, "HP Desktop Computer", "Electronics", 549, 3, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales)
VALUES (9, "Muji Notebooks", "School Supplies", 3.75, 250, 0);
INSERT INTO products (id, productName, departmentName, price, stockQuantity, productSales) 
VALUES (10, "T-shirt", "Clothes", 5, 100, 0);

SELECT * FROM products;

