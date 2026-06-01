-- ═══════════════════════════════════════════════════════════════════════
-- 004_new_schema.sql
-- Полная замена схемы: нормализованная модель с auth и кодами пинов.
-- ВНИМАНИЕ: удаляет старую таблицу achievements вместе с данными.
-- Запускать только на чистой dev-базе.
-- ═══════════════════════════════════════════════════════════════════════


-- ── UUID v7 (time-ordered, лучше для индексов чем v4) ────────────────────
CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid
LANGUAGE sql
AS $$
  SELECT encode(
    set_bit(
      set_bit(
        overlay(
          uuid_send(gen_random_uuid())
          PLACING substring(int8send(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint) FROM 3)
          FROM 1 FOR 6
        ),
        52, 1
      ),
      53, 1
    ),
    'hex'
  )::uuid;
$$;


-- ── Убираем старую схему ─────────────────────────────────────────────────
DROP TABLE IF EXISTS achievements CASCADE;


-- ── 1. Каталог типов ачивок ──────────────────────────────────────────────
-- Один ряд = один дизайн пина (Dragon Slayer, Speed Runner...).
-- Не хранит ничего про конкретного юзера.
CREATE TABLE achievement_types (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v7(),
    title        TEXT        NOT NULL,
    subtitle     TEXT,
    description  TEXT        NOT NULL,
    theme        achievement_theme NOT NULL DEFAULT 'default',
    image_url    TEXT,
    points       SMALLINT    NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── 2. Физические коды (один ряд = один напечатанный пин) ────────────────
CREATE TABLE codes (
    code                TEXT NOT NULL PRIMARY KEY,    -- формат XXXX-XXXX-XXXX
    achievement_type_id UUID NOT NULL REFERENCES achievement_types(id),
    is_used             BOOLEAN NOT NULL DEFAULT false
);


-- ── 3. Пользователи ──────────────────────────────────────────────────────
CREATE TABLE users (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v7(),
    login        TEXT        NOT NULL UNIQUE,
    password     TEXT        NOT NULL,    -- bcrypt-хэш, не plaintext
    display_name TEXT        NOT NULL,
    avatar       TEXT,
    bio          TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── 4. Refresh-токены для auth ───────────────────────────────────────────
-- Храним хэш токена, не сам токен.
-- Ротируются при каждом /auth/refresh, отзываются при /auth/logout.
CREATE TABLE refresh_tokens (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT        NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_agent  TEXT,
    ip          INET
);


-- ── 5. Разблокированные ачивки ───────────────────────────────────────────
-- Создаётся когда юзер активирует код.
-- achievement_type_id денормализован для удобства (чтобы не джойнить codes).
CREATE TABLE user_achievements (
    id                  UUID  PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id             UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code                TEXT  NOT NULL REFERENCES codes(code),
    achievement_type_id UUID  NOT NULL REFERENCES achievement_types(id),
    unlocked_at         DATE  NOT NULL DEFAULT CURRENT_DATE,
    personal_note       TEXT,
    UNIQUE (user_id, code)    -- один код — один раз на один аккаунт
);


-- ── 6. Комментарии ───────────────────────────────────────────────────────
-- user_achievement_id  → личный тред на странице конкретного юзера
-- achievement_type_id  → общий тред для всех владельцев этой ачивки
-- Ровно одно из двух заполнено, второе NULL (гарантирует CHECK).
CREATE TABLE comments (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_achievement_id UUID        REFERENCES user_achievements(id) ON DELETE CASCADE,
    achievement_type_id UUID        REFERENCES achievement_types(id) ON DELETE CASCADE,
    text                TEXT        NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    modified_at         TIMESTAMPTZ,
    reply_to_id         UUID        REFERENCES comments(id) ON DELETE SET NULL,
    CONSTRAINT comments_one_target CHECK (
        (user_achievement_id IS NOT NULL AND achievement_type_id IS NULL) OR
        (user_achievement_id IS NULL     AND achievement_type_id IS NOT NULL)
    )
);


-- ── Индексы ──────────────────────────────────────────────────────────────
CREATE INDEX ON refresh_tokens (user_id);
CREATE INDEX ON refresh_tokens (token_hash);

CREATE INDEX ON user_achievements (user_id);
CREATE INDEX ON user_achievements (achievement_type_id);

CREATE INDEX ON comments (user_achievement_id);
CREATE INDEX ON comments (achievement_type_id);
CREATE INDEX ON comments (reply_to_id);


-- ═══════════════════════════════════════════════════════════════════════
-- Seed: тестовые данные для разработки
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO achievement_types (id, title, subtitle, description, theme, points) VALUES
    ('018f4e1a-0000-7000-8000-000000000001', 'Seven Nation Army',  'Ветеран цифровых окопов',   'Пройти пять или более игр, посвящённых Второй мировой войне',                    'gaming', 150),
    ('018f4e1a-0000-7000-8000-000000000002', 'Fireball!!!',        'Шеф-повар поневоле',        'Поджечь масло в процессе готовки. Незапланированный огненный эффект засчитывается', 'cozy',   75),
    ('018f4e1a-0000-7000-8000-000000000003', 'Git Blame',          'Автор легендарного бага',   'Найти свой собственный коммит в git blame прямо на продакшне',                   'retro',  100),
    ('018f4e1a-0000-7000-8000-000000000004', 'Чайный мастер',      'Хранитель термоса',         'Выпить более 15 литров чая за один календарный месяц',                          'forest',  50),
    ('018f4e1a-0000-7000-8000-000000000005', 'Dark Mode Forever',  'Враг белых экранов',        'Провести в тёмной теме суммарно более 1000 часов',                              'retro',   80),
    ('018f4e1a-0000-7000-8000-000000000006', 'Stack Overflow',     'Мастер копипасты',          'Использовать один и тот же ответ со Stack Overflow в трёх разных проектах',     'gaming',  60),
    ('018f4e1a-0000-7000-8000-000000000007', 'Лесной отшельник',   'Один на один с природой',   'Провести выходные без интернета в лесу и выжить',                               'forest', 120),
    ('018f4e1a-0000-7000-8000-000000000008', 'Уютный вечер',       'Мастер атмосферы',          'Приготовить глинтвейн, зажечь свечи и досмотреть сериал до конца',              'cozy',    40),
    ('018f4e1a-0000-7000-8000-000000000009', 'README.md',          'Легенда документации',      'Написать README, который кто-то кроме тебя действительно прочитал',             'retro',  200);


-- Несколько кодов на каждый тип (имитируем партию пинов)
INSERT INTO codes (code, achievement_type_id) VALUES
    ('ARMY-7NA1-TST1', '018f4e1a-0000-7000-8000-000000000001'),
    ('ARMY-7NA1-TST2', '018f4e1a-0000-7000-8000-000000000001'),
    ('FIRE-BBB1-TST1', '018f4e1a-0000-7000-8000-000000000002'),
    ('FIRE-BBB1-TST2', '018f4e1a-0000-7000-8000-000000000002'),
    ('GITB-LM01-TST1', '018f4e1a-0000-7000-8000-000000000003'),
    ('GITB-LM01-TST2', '018f4e1a-0000-7000-8000-000000000003'),
    ('TEAM-STR1-TST1', '018f4e1a-0000-7000-8000-000000000004'),
    ('DRKM-ODE1-TST1', '018f4e1a-0000-7000-8000-000000000005'),
    ('DRKM-ODE1-TST2', '018f4e1a-0000-7000-8000-000000000005'),
    ('STKO-VR01-TST1', '018f4e1a-0000-7000-8000-000000000006'),
    ('FRST-HRM1-TST1', '018f4e1a-0000-7000-8000-000000000007'),
    ('COZY-EVN1-TST1', '018f4e1a-0000-7000-8000-000000000008'),
    ('RDME-DOC1-TST1', '018f4e1a-0000-7000-8000-000000000009'),
    ('RDME-DOC1-TST2', '018f4e1a-0000-7000-8000-000000000009');


-- Тестовый пользователь (пароль: "password" в bcrypt)
INSERT INTO users (id, login, password, display_name, bio) VALUES
    (
        '018f4e1a-0000-7000-8000-000000000010',
        'julia',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'Julia',
        'Frontend dev. Collecting pins.'
    );


-- Тестовый юзер уже разблокировал несколько ачивок
INSERT INTO user_achievements (id, user_id, code, achievement_type_id, unlocked_at) VALUES
    (
        '018f4e1a-0000-7000-8000-000000000020',
        '018f4e1a-0000-7000-8000-000000000010',
        'ARMY-7NA1-TST1',
        '018f4e1a-0000-7000-8000-000000000001',
        CURRENT_DATE - 45
    ),
    (
        '018f4e1a-0000-7000-8000-000000000021',
        '018f4e1a-0000-7000-8000-000000000010',
        'GITB-LM01-TST1',
        '018f4e1a-0000-7000-8000-000000000003',
        CURRENT_DATE - 12
    ),
    (
        '018f4e1a-0000-7000-8000-000000000022',
        '018f4e1a-0000-7000-8000-000000000010',
        'RDME-DOC1-TST1',
        '018f4e1a-0000-7000-8000-000000000009',
        CURRENT_DATE - 3
    );
