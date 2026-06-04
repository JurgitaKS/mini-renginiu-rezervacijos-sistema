-- Atnaujina events.category į reikšmes, kurias naudoja /events filtras:
-- Pramogos, Mokymai, Muzika, Sportas
--
-- Kur paleisti: Supabase Dashboard → SQL Editor → New query → įklijuok ir Run
-- (tas pats projektas, kurį rodo .env.local NEXT_PUBLIC_SUPABASE_URL)

update events
set category = 'Muzika'
where category in ('Koncertas', 'koncertas');

update events
set category = 'Mokymai'
where category in ('Seminaras', 'seminaras', 'Workshop', 'workshop', 'Kita', 'kita');

-- Sportas dažnai jau teisingas; jei buvo kitokia rašyba:
update events
set category = 'Sportas'
where lower(category) = 'sportas'
  and category <> 'Sportas';

-- Pavyzdiniai seed įrašai (jei pavadinimai sutampa):
update events set category = 'Muzika' where title = 'Vasaros koncertas';
update events set category = 'Mokymai' where title = 'Programavimo seminaras';
update events set category = 'Sportas' where title = '5 km bėgimas';
update events set category = 'Mokymai' where title = 'Fotografijos workshop';
