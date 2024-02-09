CREATE TABLE IF NOT EXISTS post (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    subject TEXT NOT NULL,
                                    content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comment (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       post_id INTEGER NOT NULL,
                                       content TEXT NOT NULL,
                                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                       FOREIGN KEY (post_id) REFERENCES post (id)
);
