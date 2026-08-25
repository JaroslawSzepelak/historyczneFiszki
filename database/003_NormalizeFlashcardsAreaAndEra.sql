USE `historyczne_fiszki`;

START TRANSACTION;

UPDATE `flashcards`
SET
  `area` = CASE `area`
    WHEN 'polska' THEN 'Polska'
    WHEN 'świat' THEN 'Świat'
    ELSE `area`
  END,
  `era` = CASE `era`
    WHEN 'prehistoria' THEN 'Prehistoria'
    WHEN 'starozytnosc' THEN 'Starożytność'
    WHEN 'sredniowiecze' THEN 'Średniowiecze'
    WHEN 'nowozytnosc' THEN 'Nowożytność'
    WHEN 'wspolczesnosc' THEN 'Współczesność'
    ELSE `era`
  END
WHERE `id` > 0
  AND (
    `area` IN ('polska', 'świat')
    OR `era` IN ('prehistoria', 'starozytnosc', 'sredniowiecze', 'nowozytnosc', 'wspolczesnosc')
  );

COMMIT;
