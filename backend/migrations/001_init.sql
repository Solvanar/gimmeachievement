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
    ('Первая кровь',   'Ты запустила свой первый проект и он не сломался в первый же день.', 'gaming'),
    ('Мастер ножа',    'Нарезала лук не заплакав. Легенда.',                                 'cooking'),
    ('Ночной хакер',   'Три ночи подряд за кодом — и оно работает.',                          'gaming'),
    ('Пирог с нуля',   'Тесто замешано вручную, начинка придумана самостоятельно.',            'cooking'),
    ('Git Blame',      'Нашла баг, которому 2 года. Автор — ты сама.',                        'gaming');
