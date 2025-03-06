-- Puzzle content population script

-- Clear existing puzzle data
DELETE FROM puzzles;
DELETE FROM puzzle_rooms;

-- Create puzzle rooms
INSERT INTO puzzle_rooms (id, name, description, difficulty, time_limit) VALUES
(1, 'Cyber Security Lab', 'A high-tech security lab with advanced encryption puzzles', 'Medium', 1800),
(2, 'Neural Network Hub', 'Navigate through a complex network of AI-driven challenges', 'Hard', 2400),
(3, 'Data Center Maze', 'Find your way through a maze of servers and firewalls', 'Easy', 1200);

-- Riddle puzzles
INSERT INTO puzzles (room_id, type, config, order_index) VALUES
(1, 'riddle', '{
    "riddle": "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. I have roads, but no cars. What am I?",
    "answer": "map"
}', 1),
(2, 'riddle', '{
    "riddle": "What has keys, but no locks; space, but no room; and you can enter, but not go in?",
    "answer": "keyboard"
}', 1);

-- Math logic puzzles
INSERT INTO puzzles (room_id, type, config, order_index) VALUES
(1, 'math-logic', '{
    "problem": "If a hacker can crack 4 passwords in 8 minutes, how many passwords can they crack in 24 minutes?",
    "answer": 12,
    "explanation": "Using the ratio: 4 passwords / 8 minutes = x passwords / 24 minutes"
}', 2),
(2, 'math-logic', '{
    "problem": "A binary sequence starts with 2, 4, 8, 16. What is the next number?",
    "answer": 32,
    "explanation": "Each number is doubled to get the next in the sequence"
}', 2);

-- Cipher puzzles
INSERT INTO puzzles (room_id, type, config, order_index) VALUES
(1, 'cipher', '{
    "encodedMessage": "XLMW MW E WIGYVMXC FVIEGL",
    "solution": "THIS IS A SECURITY BREACH",
    "shift": 4,
    "cipherType": "caesar"
}', 3),
(2, 'cipher', '{
    "encodedMessage": ".-- . .-.. -.-. --- -- .",
    "solution": "WELCOME",
    "cipherType": "morse"
}', 3);

-- Maze navigation puzzles
INSERT INTO puzzles (room_id, type, config, order_index) VALUES
(3, 'maze-navigation', '{
    "maze": [
        [0,0,0,1,0],
        [1,1,0,1,0],
        [0,0,0,0,0],
        [0,1,1,1,0],
        [0,0,0,1,0]
    ],
    "startPos": {"x": 0, "y": 0},
    "endPos": {"x": 4, "y": 4}
}', 1);

-- Combination lock puzzles
INSERT INTO puzzles (room_id, type, config, order_index) VALUES
(1, 'combination-lock', '{
    "combination": "1337",
    "hint": "Common hacker number"
}', 4),
(2, 'combination-lock', '{
    "combination": "2048",
    "hint": "Power of 2 commonly used in encryption"
}', 4);

-- Object finding puzzles
INSERT INTO puzzles (room_id, type, config, order_index) VALUES
(3, 'object-finding', '{
    "objects": [
        {"id": "1", "name": "Access Card", "x": 25, "y": 35},
        {"id": "2", "name": "USB Drive", "x": 75, "y": 45},
        {"id": "3", "name": "Security Badge", "x": 55, "y": 65}
    ]
}', 2);