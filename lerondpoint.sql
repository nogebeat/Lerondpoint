drop database lerondpoint;

create database if not exists lerondpoint;

use lerondpoint;


CREATE TABLE IF NOT EXISTS user (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    confpass VARCHAR(255) NOT NULL,
    adress VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    sex ENUM('masculin', 'feminin', 'transgenre', 'Non déterminé', 'autre') NOT NULL,
    rank INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_verified (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    verified ENUM('Verified', 'not Verified') DEFAULT 'not Verified' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT UNSIGNED,
    username VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS token_verified (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_token VARCHAR(255) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT UNSIGNED,
    username VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS todo (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_time DATETIME NOT NULL,
    status ENUM('not started', 'todo', 'in progress', 'done') DEFAULT 'not started',
    user_id BIGINT UNSIGNED,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 'project'
CREATE TABLE IF NOT EXISTS project (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME,
    status ENUM('not started', 'in progress', 'completed') DEFAULT 'not started',
    owner_id BIGINT UNSIGNED,
    FOREIGN KEY (owner_id) REFERENCES user(id)
);

-- table 'task' pour les taches quoi !!!
CREATE TABLE IF NOT EXISTS task (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    status ENUM('not started', 'in progress', 'done') DEFAULT 'not started',
    project_id BIGINT UNSIGNED,
    assigned_user_id BIGINT UNSIGNED,
    FOREIGN KEY (project_id) REFERENCES project(id),
    FOREIGN KEY (assigned_user_id) REFERENCES user(id)
);

-- table 'comment'
CREATE TABLE IF NOT EXISTS comment (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    task_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    FOREIGN KEY (task_id) REFERENCES task(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

--table 'attachment'
CREATE TABLE IF NOT EXISTS attachment (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    file_path VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    task_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    FOREIGN KEY (task_id) REFERENCES task(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- la table 'label' ( A DETERMINE )
CREATE TABLE IF NOT EXISTS label (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 'task_label' pour associer des labels aux tâches
CREATE TABLE IF NOT EXISTS task_label (
    task_id BIGINT UNSIGNED,
    label_id BIGINT UNSIGNED,
    PRIMARY KEY (task_id, label_id),
    FOREIGN KEY (task_id) REFERENCES task(id),
    FOREIGN KEY (label_id) REFERENCES label(id)
);

--la table 'team' pour gérer les équipes
CREATE TABLE IF NOT EXISTS team (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--table 'team_member' pour associer des utilisateurs aux équipes
CREATE TABLE IF NOT EXISTS team_member (
    team_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    role ENUM('owner', 'member') DEFAULT 'member',
    PRIMARY KEY (team_id, user_id),
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

--table 'collaborator' pour associer des utilisateurs aux projets
CREATE TABLE IF NOT EXISTS collaborator (
    project_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    role ENUM('owner', 'collaborator') DEFAULT 'collaborator',
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES project(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
