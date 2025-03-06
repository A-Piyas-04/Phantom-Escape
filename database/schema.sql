-- Database schema for Cyberpunk Digital Escape Room Game

CREATE DATABASE IF NOT EXISTS escape_room_game;
USE escape_room_game;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Rooms table
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level INT NOT NULL,
    time_limit INT NOT NULL, -- Time limit in seconds
    sequence_order INT NOT NULL -- Order in which rooms appear
);

-- Puzzles table
CREATE TABLE puzzles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    solution TEXT NOT NULL,
    points INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Hints table
CREATE TABLE hints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    puzzle_id INT NOT NULL,
    hint_text TEXT NOT NULL,
    point_penalty INT NOT NULL, -- Points deducted for using this hint
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id)
);

-- User Progress table
CREATE TABLE user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    completion_time TIMESTAMP NULL,
    score INT DEFAULT 0,
    status ENUM('in_progress', 'completed', 'failed') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- User Puzzle Progress table
CREATE TABLE user_puzzle_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_progress_id INT NOT NULL,
    puzzle_id INT NOT NULL,
    solved BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    hints_used INT DEFAULT 0,
    solved_time TIMESTAMP NULL,
    FOREIGN KEY (user_progress_id) REFERENCES user_progress(id),
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id)
);

-- Leaderboard table
CREATE TABLE leaderboard (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    score INT NOT NULL,
    completion_time INT NOT NULL, -- Time taken in seconds
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);