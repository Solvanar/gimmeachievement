-- Все существующие ачивки — взяты
UPDATE achievements
SET unlocked = true, unlocked_at = CURRENT_DATE - (RANDOM() * 180)::INT
WHERE unlocked = false;

-- Новые невзятые ачивки
INSERT INTO achievements (title, subtitle, description, theme, points, code) VALUES
    (
        'Dark Mode Forever',
        'Враг белых экранов',
        'Провести в тёмной теме суммарно более 1000 часов',
        'retro', 80, 'DRK-MODE'
    ),
    (
        'Stack Overflow',
        'Мастер копипасты',
        'Использовать один и тот же ответ со Stack Overflow в трёх разных проектах',
        'gaming', 60, 'STK-OVR'
    ),
    (
        'Лесной отшельник',
        'Один на один с природой',
        'Провести выходные без интернета в лесу и выжить',
        'forest', 120, 'FRS-HRM'
    ),
    (
        'Уютный вечер',
        'Мастер атмосферы',
        'Приготовить глинтвейн, зажечь свечи и досмотреть сериал до конца',
        'cozy', 40, 'COZ-EVN'
    ),
    (
        'README.md',
        'Легенда документации',
        'Написать README, который кто-то кроме тебя действительно прочитал',
        'retro', 200, 'RDM-DOC'
    );
