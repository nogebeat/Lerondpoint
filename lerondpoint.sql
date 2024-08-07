drop database lerondpoint;

create database if not exists lerondpoint;

use lerondpoint;


CREATE TABLE if not exists user (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR (20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    confpass VARCHAR(255) NOT NULL,
    adress VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    sex ENUM('masculin', 'feminin', 'transgenre', 'Non déterminé','autre') NOT NULL,
    rank INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  if not exists todo (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_time DATETIME NOT NULL,
    status ENUM('not started', 'todo', 'in progress', 'done') DEFAULT 'not started',
    user_id BIGINT UNSIGNED,
    username VARCHAR(255),
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE if not exists user_verified (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    verified ENUM('Verified', 'not Verified') DEFAULT 'not Verified' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT UNSIGNED,
    username VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE if not exists token_verified (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_token VARCHAR(255) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT UNSIGNED,
    username VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
