-- Profile details extension for Cyberpunk Digital Escape Room Game

USE escape_room_game;

CREATE TABLE profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    bio TEXT,
    gameplay_preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add index for faster profile lookups
CREATE INDEX idx_profile_user ON profile(user_id);

-- Insert default avatar path for existing users
ALTER TABLE users ADD COLUMN default_avatar VARCHAR(255) DEFAULT '/assets/avatars/default_cyberpunk.png' AFTER email;