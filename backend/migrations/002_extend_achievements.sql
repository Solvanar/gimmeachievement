-- ── 1. Меняем enum тем на значения, которые использует фронт ─────────────
ALTER TABLE achievements ALTER COLUMN theme TYPE TEXT;
DROP TYPE achievement_theme;
CREATE TYPE achievement_theme AS ENUM ('gaming', 'retro', 'cozy', 'forest', 'default');

UPDATE achievements SET theme =
    CASE theme
        WHEN 'gaming'   THEN 'gaming'
        WHEN 'cooking'  THEN 'cozy'
        ELSE theme
    END;

ALTER TABLE achievements
    ALTER COLUMN theme TYPE achievement_theme USING theme::achievement_theme;

-- ── 2. Добавляем недостающие колонки ──────────────────────────────────────
ALTER TABLE achievements
    ADD COLUMN subtitle       TEXT,
    ADD COLUMN points         SMALLINT NOT NULL DEFAULT 0,
    ADD COLUMN unlocked       BOOLEAN  NOT NULL DEFAULT false,
    ADD COLUMN unlocked_at    DATE,
    ADD COLUMN personal_note  TEXT,
    ADD COLUMN code           TEXT,
    ADD COLUMN category       TEXT,
    ADD COLUMN accent_color   TEXT,
    ADD COLUMN custom_icon    TEXT;

-- ── 3. Пересеиваем данные с полными полями ────────────────────────────────
DELETE FROM achievements;

INSERT INTO achievements (title, subtitle, description, theme, points, code) VALUES
    (
        'Seven Nation Army',
        'Ветеран цифровых окопов',
        'Пройти пять или более игр, посвящённых Второй мировой войне',
        'gaming', 150, 'ARMY-7NA'
    ),
    (
        'Fireball!!!',
        'Шеф-повар поневоле',
        'Поджечь масло в процессе готовки. Незапланированный огненный эффект засчитывается',
        'cozy', 75, 'FIRE-XXX'
    ),
    (
        'Git Blame',
        'Автор легендарного бага',
        'Найти свой собственный коммит в git blame прямо на продакшне',
        'retro', 100, 'GIT-BLM'
    ),
    (
        'Чайный мастер',
        'Хранитель термоса',
        'Выпить более 15 литров чая за один календарный месяц',
        'forest', 50, 'TEA-MST'
    );
