CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    pfp_url VARCHAR(255)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    recipe TEXT,
    imageurl VARCHAR(255),
    fruit VARCHAR(255)
);

CREATE TABLE favorites (
    user_id INT,
    product_id INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE articles (
    article_id INT PRIMARY KEY AUTO_INCREMENT, 
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
);