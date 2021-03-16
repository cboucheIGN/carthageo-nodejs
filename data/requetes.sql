select * from COUNTRY order by NAME ASC

insert into countrysoc (cod, soc, boy80, boy84, exbloc) values ('KAZ', false, false, false, true)
--UPDATE countrysoc SET exbloc = true WHERE cod LIKE 'CZE'

--DROP TABLE countrysocgeom
CREATE TABLE countrysocgeom AS (
	SELECT soc, boy80, boy84, exbloc, country.code, country.geometry, country.pop, country.name, country.first_participation, country.last_participation
	FROM countrysoc 
	INNER JOIN country ON countrysoc.cod = country.code
);

SELECT soc, exbloc, code FROM countrysocgeom WHERE exbloc = 'True'
select * from countrysocgeom order by code desc
select * from countrysoc order by cod desc


















select * from athlete;
select * from country;
select * from gendercount;
select * from event;


drop table gendercount;
CREATE TABLE gendercount AS (
	select a.country_id, a.id,a.gender,c.name, c.code from athlete as a 
	inner join country as c on c.id = a.country_id
);

---Conversion de la variable Men en numéric
ALTER TABLE gendercount ADD cnt_men numeric;
UPDATE gendercount SET cnt_men = (CASE WHEN gender='Men' THEN 1
ELSE 0
END)
---Conversion de la variable Women en numéric
ALTER TABLE gendercount ADD cnt_women numeric;
UPDATE gendercount SET cnt_women = (CASE WHEN gender='Women' THEN 1
ELSE 0
END)


--- Somme de nombre d'athlete par genre
drop table totgender;
CREATE TABLE totgender AS (
SELECT name, SUM(cnt_men) AS tot_men, SUM(cnt_women) AS tot_women
FROM gendercount
GROUP BY name
);

--- Calcul du nombre total d'athlete 
select count(name) from country
create table totgendercod as (select country.name, tot_men, tot_women, pct_men, pct_women, country.code from totgender join country on country.name = totgender.name )

ALTER TABLE totgender ADD tot numeric;
UPDATE totgender SET tot =(tot_men + tot_women);
--- Calcul du pourcentage d'athlete par genre
---Pourcentage d'homme
ALTER TABLE totgender ADD pct_men numeric;
UPDATE totgender SET pct_men =(tot_men / tot) * 100;

---Pourcentage de femme
ALTER TABLE totgender ADD pct_women numeric;
UPDATE totgender SET pct_women =(tot_women / tot) * 100;

--------------Calcul du nombre de médail par athlete -------------------------------------------
drop table athcount;
---- Jointure des 
CREATE TABLE athcount AS (
	select a.country_id,a.id, a.gender, a.name, c.code, e.sport from athlete as a 
	inner join country as c on c.id = a.country_id
	left join medal as m on a.id = m.athlete_id
	left join event as e on e.id = m.event_id
	
);
select * from athcount WHERE name LIKE '%BOLT%';

--- calcul du nombre de médaille par athlete
drop table totmedath;
CREATE TABLE totmedath as (
	SELECT athcount.id as id, athcount.code as code, country.name as country, athcount.name, sport, COUNT(athcount.id) as cnt_med FROM athcount JOIN country ON country.code = athcount.code group by athcount.id, athcount.name, athcount.code, country.name, sport
);

---requête
select * from totmedath order by cnt_med desc;
SELECT * FROM totmedath WHERE name LIKE 'KRAVCHUK, Igor';
SELECT * FROM totmedath where cnt_med > 5 order by cnt_med;

--- Aggrégation des pays et types de sport des athlete
DROP TABLE medath
CREATE TABLE medath as (
	SELECT name, sum(cnt_med) AS sum_med, string_agg (distinct country, ', ') as all_country, string_agg(distinct code, ', ') AS all_code, string_agg(DISTINCT sport, ', ') AS all_sport
	FROM totmedath GROUP BY name ORDER BY sum_med DESC
);
SELECT * FROM medath

DROP TABLE athsports
CREATE TABLE athsports AS (
	SELECT totmedath.name as name, country.name as country, totmedath.code as code, totmedath.sport as sport, totmedath.cnt_med as med_sport, medath.sum_med as med_all, medath.all_country, medath.all_sport, medath.all_code FROM totmedath
	LEFT JOIN medath ON totmedath.name = medath.name
	LEFT JOIN country ON totmedath.code = country.code
	ORDER BY med_all DESC);

SELECT * FROM athsports
SELECT name, med_sport, med_all, sum(med_sport) as med_country, country, all_country, all_sport
	FROM athsports
	WHERE code LIKE 'RUS'
	GROUP BY name, country, all_country, all_sport, med_sport, med_all
	ORDER BY med_country DESC LIMIT 10

select * from totgendercod;

select * from totmedath order by cnt_med desc;
SELECT * FROM totmedath WHERE name LIKE 'KRAVCHUK, Igor';
SELECT * FROM totmedath where cnt_med > 5 order by cnt_med;


---- *******************************------

