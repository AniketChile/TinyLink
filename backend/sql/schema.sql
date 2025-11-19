CREATE TABLE links (
    code VARCHAR(10) PRIMARY KEY,
    target_url TEXT NOT NULL,
    total_clicks INT DEFAULT 0,
    last_clicked TIMESTAMP
);
