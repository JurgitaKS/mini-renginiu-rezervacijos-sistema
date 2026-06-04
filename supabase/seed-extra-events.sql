-- Papildomi renginiai (paleisk Supabase SQL Editor po schema.sql)
-- Kategorijos: Vaikams, Senjorams, Verslui, Mokymai

insert into events (
  title,
  description,
  event_date,
  event_time,
  location,
  category,
  price,
  total_seats,
  available_seats
)
values
  (
    'Vaikų kūrybinės dirbtuvės',
    'Spalvingos kūrybinės dirbtuvės vaikams: piešimas, karpymas ir rankdarbiai.',
    '2026-07-20',
    '12:00',
    'Vilnius',
    'Vaikams',
    6,
    25,
    25
  ),
  (
    'Šeimos teatro popietė',
    'Linksmas teatro pasirodymas vaikams ir jų tėvams.',
    '2026-07-22',
    '15:00',
    'Kaunas',
    'Vaikams',
    8,
    40,
    40
  ),
  (
    'Senjorų sveikatingumo rytas',
    'Lengva mankšta, kvėpavimo pratimai ir pokalbis apie sveiką gyvenseną.',
    '2026-07-24',
    '10:00',
    'Vilnius',
    'Senjorams',
    0,
    30,
    30
  ),
  (
    'Senjorų rankdarbių užsiėmimas',
    'Jaukus užsiėmimas senjorams: mezgimas, nėrimas ir bendravimas prie arbatos.',
    '2026-07-26',
    '11:00',
    'Panevėžys',
    'Senjorams',
    3,
    20,
    20
  ),
  (
    'Vadovų lyderystės seminaras',
    'Praktinis seminaras vadovams apie komandos motyvavimą ir sprendimų priėmimą.',
    '2026-07-29',
    '09:30',
    'Vilnius',
    'Verslui',
    45,
    35,
    35
  ),
  (
    'Darbo kolektyvo komandos formavimas',
    'Interaktyvūs užsiėmimai darbo kolektyvui, skirti bendradarbiavimui stiprinti.',
    '2026-08-02',
    '13:00',
    'Trakai',
    'Verslui',
    30,
    50,
    50
  ),
  (
    'Karjeros planavimo seminaras',
    'Seminaras apie CV, darbo pokalbį ir karjeros tikslų planavimą.',
    '2026-08-04',
    '17:00',
    'Kaunas',
    'Mokymai',
    10,
    30,
    30
  ),
  (
    'Vasaros edukacija vaikams gamtoje',
    'Pažintinis renginys vaikams apie gamtą, augalus ir saugų elgesį lauke.',
    '2026-08-07',
    '10:30',
    'Alytus',
    'Vaikams',
    5,
    25,
    25
  ),
  (
    'Muzikinė popietė senjorams',
    'Gyvos muzikos popietė su žinomomis lietuviškomis dainomis.',
    '2026-08-10',
    '14:00',
    'Klaipėda',
    'Senjorams',
    4,
    60,
    60
  ),
  (
    'Streso valdymo seminaras darbuotojams',
    'Praktinis seminaras apie stresą darbe, poilsį ir emocinę savijautą.',
    '2026-08-12',
    '10:00',
    'Vilnius',
    'Verslui',
    25,
    40,
    40
  );
