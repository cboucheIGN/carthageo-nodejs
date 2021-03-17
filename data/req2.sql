DROP TABLE athcount
CREATE TABLE athcount AS (
	SELECT a.gender, a.name, c.code, c.name as country, e.sport, olympiad.year from athlete as a 
	inner join country as c on c.id = a.country_id
	left join medal as m on a.id = m.athlete_id
	left join event as e on e.id = m.event_id
	left join olympiad on m.olympiad_id = olympiad.id
);

DROP TABLE athcount2
CREATE TABLE athcount2 AS (
	SELECT gender, name, country, year::text, sport, count(name) as medal FROM athcount
	GROUP BY gender, name, country, year, sport
);
DROP TABLE athyear
CREATE TABLE athyear AS (
	SELECT name, string_agg (distinct year, ', ') as year FROM athcount2
	GROUP BY name
)

SELECT * FROM ath
--- calcul du nombre de médaille par athlete
drop table totmedath;
CREATE TABLE totmedath as (
	SELECT 
		athcount.id as id, 
		athcount.code as code, 
		country.name as country, 
		athcount.name, sport, 
		COUNT(athcount.id) as cnt_med
	FROM athcount JOIN country ON country.code = athcount.code
	GROUP BY athcount.id, athcount.name, athcount.code, country.name, sport
);

--- Aggrégation des pays et types de sport des athlete
DROP TABLE medath
CREATE TABLE medath as (
	SELECT name, sum(cnt_med) AS sum_med, string_agg (distinct country, ', ') as all_country, string_agg(distinct code, ', ') AS all_code, string_agg(DISTINCT sport, ', ') AS all_sport
	FROM totmedath GROUP BY name ORDER BY sum_med DESC
);
SELECT * FROM medath

DROP TABLE athsports
CREATE TABLE athsports AS (
	SELECT totmedath.name as name, country.name as country, totmedath.code as code, totmedath.sport as sport, totmedath.cnt_med as med_sport, medath.sum_med as med_all, medath.all_country, medath.all_sport, medath.all_code
	FROM totmedath
	LEFT JOIN medath ON totmedath.name = medath.name
	LEFT JOIN country ON totmedath.code = country.code
	ORDER BY med_all DESC);

SELECT * FROM athsports
SELECT name, med_sport, med_all, sum(med_sport) as med_country, country, all_country, all_sport
	FROM athsports
	WHERE code LIKE 'RUS'
	GROUP BY name, country, all_country, all_sport, med_sport, med_all
	ORDER BY med_country DESC LIMIT 10








SELECT * FROM athsports
SELECT name, med_sport, med_all, sum(med_sport) as med_country, country, all_country, all_sport
	FROM athsports
	WHERE code LIKE 'RUS' AND sport LIKE 'Aquatics' AND 
	GROUP BY name, country, all_country, all_sport, med_sport, med_all
	ORDER BY med_country DESC LIMIT 10
	
DROP TABLE ath
CREATE TABLE ath AS(
SELECT athsports.*, athlete.gender, athyear.year FROM athsports
JOIN athlete ON athsports.name = athlete.name
JOIN athyear ON athsports.name = athyear.name
	);
	
SELECT * FROM ath
SELECT name, sum(med_sport) as med_country, all_sport, all_country, year FROM ath WHERE code LIKE 'RUS'  AND gender ILIKE '%men' GROUP BY name, med_sport, all_sport, all_country, year ORDER BY med_country DESC LIMIT 20--sport
	
SELECT name, sum(med_sport) AS med, all_sport, all_country, year FROM ath WHERE code LIKE 'RUS' AND gender ILIKE '%men' GROUP BY name, med_sport, all_sport, all_country, year ORDER BY med DESC LIMIT 20

SELECT name, sum(med_sport) as med_country, all_sport, all_country FROM ath WHERE code LIKE 'RUS' AND gender ILIKE '%men' GROUP BY name, med_sport, all_sport, all_country ORDER BY med_country DESC LIMIT 20--sport


SELECT sport, sum(med_sport) AS med FROM ath WHERE code LIKE 'FIN' GROUP BY sport ORDER BY med DESC LIMIT 5
"SELECT sport, sum(med_sport) FROM ath WHERE code LIKE " + req.body.paysClick + "'FIN' GROUP BY sport ORDER BY sum DESC LIMIT 5"

SELECT tot_women, tot_men FROM totgender WHERE cod

DROP TABLE genre
CREATE TABLE genre AS (
	SELECT CONCAT(tot_women,',', tot_men) AS w_m, country.code FROM totgender
	JOIN country ON totgender.name = country.name
);

SELECT * FROM genre WHERE code LIKE 'FIN'

select * from countrysocgeom