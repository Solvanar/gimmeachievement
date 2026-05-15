CREATE TYPE achievement_theme AS ENUM ('gaming', 'cooking', 'default');

CREATE TABLE IF NOT EXISTS achievements (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title      TEXT NOT NULL,
    description TEXT NOT NULL,
    theme      achievement_theme NOT NULL DEFAULT 'default',
    image_url  TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed data
INSERT INTO achievements (title, description, theme) VALUES
    ('Seven nation army', 'Пройти 5+ игр по WW2', 'gaming'),
    ('Fireball!!!', 'Поджег масло в процессе готовки', 'cooking'),
    ('Git Blame', 'Нашел свой собственный баг на проде', 'gaming');
