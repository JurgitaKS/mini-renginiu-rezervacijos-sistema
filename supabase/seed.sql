-- Pasirenkama: pavyzdiniai renginiai (paleisk po schema.sql)

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
) values
  (
    'Vasaros koncertas',
    'Lauko koncertas su vietiniais atlikėjais.',
    '2026-07-15',
    '19:00',
    'Vilnius, Vingio parkas',
    'Muzika',
    25.00,
    100,
    100
  ),
  (
    'Programavimo seminaras',
    'Įvadas į Next.js ir TypeScript pradedantiesiems.',
    '2026-08-02',
    '10:00',
    'Kaunas, Technologijų parkas',
    'Mokymai',
    0,
    30,
    30
  ),
  (
    '5 km bėgimas',
    'Draugiškas bėgimas visai šeimai.',
    '2026-09-10',
    '09:30',
    'Klaipėda, Jūros takas',
    'Sportas',
    10.00,
    50,
    50
  ),
  (
    'Fotografijos workshop',
    'Praktinis užsiėmimas su profesionalu.',
    '2026-10-05',
    '14:00',
    'Šiauliai, Kultūros centras',
    'Mokymai',
    35.00,
    20,
    20
  );
