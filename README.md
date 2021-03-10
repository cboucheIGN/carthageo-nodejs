# Projet

### 1. Installer le projet


```
git clone <git_projet>
npm install
```

### 2. Executer le server

```bash
npm start
## puis ouvrir son navigateur sur http://localhost:3000
```

### 3. Explication

```yml
- api:
  - controller: "Programmation des actions de chaque route"
  - model: "Modèle des données en base"
  - route: "Attribution d'une action en fonction de l'adresse"
- app:
  - view: "Les modèle de page HTML"
- public:
  - img: "Repertoire d'images"
  - js: "Repertoire de scripts"
  - css: "Repertoire de styles"
  - lib: "Différentes librairies externe"
```

# carthageo-projet
Sujet et données du projet Carthagéo 2020

## Création de la base

### Par le SGBD pgAdmin
* Se connecter à localhost
* Créer une base *olympics*
  + `CREATE DATABASE olympics;`
* Ouvrir la base olympics
  + Executer le fichier SQL `olympics.schema.sql`
  + Executer le fichier SQL `olympics.data.sql`

### En ligne de commande

* Ouvrir un terminal
* Lancer les commandes suivantes

```bash
psql -U postgres -h localhost -d postgres -c "CREATE DATABASE olympics;"
psql -U postgres -h localhost -d olympics -f "olympics.schema.sql"
psql -U postgres -h localhost -d olympics -f "olympics.data.sql"
```

### Liens utiles
```
https://en.wikipedia.org/wiki/Venues_of_the_1980_Summer_Olympics#Outside_in_Moscow
https://en.wikipedia.org/wiki/1980_Summer_Olympics
https://digitalarchive.wilsoncenter.org/collection/266/soviet-union-and-the-olympics
http://blogs.bu.edu/guidedhistory/russia-and-its-empires/guy-mcfall/
https://en.wikipedia.org/wiki/Soviet_Union_at_the_Olympics
https://apnews.com/article/winter-olympics-boycotts-cold-war-afghanistan-soviet-union-8b447c53e96621f1ca2b06e8621b351f
```

```sql
SELECT count(medal.medal) as m, country.name, country.code, ST_AsGeoJSON(country.geometry) FROM medal
INNER JOIN athlete ON athlete.id= medal.athlete_id
INNER JOIN olympiad ON olympiad.id = medal.olympiad_id
INNER JOIN country ON athlete.country_id = country.id
INNER JOIN event ON medal.event_id = event.id
WHERE olympiad.year = 1980 AND olympiad.season LIKE 'Summer' 
GROUP BY country.name, country.code, ST_AsGeoJSON(country.geometry)  ORDER BY m DESC

--medal.medal, event.discipline
```


```sql
DROP TABLE jomed;

--table totale
CREATE TABLE jomed AS
SELECT
	count(medal.medal) as mtot,
	event.sport, 
	country.name,
	medal.medal, 
	olympiad.year,
	olympiad.season, 
	country.code
FROM
	medal
INNER JOIN athlete ON athlete.id= medal.athlete_id
INNER JOIN olympiad ON olympiad.id = medal.olympiad_id
INNER JOIN country ON athlete.country_id = country.id
INNER JOIN event ON medal.event_id = event.id
--WHERE
--	olympiad.year = 1980 AND olympiad.season LIKE 'Summer' 
GROUP BY
	country.name,
	olympiad.year,
	event.sport,
	olympiad.season,
	country.code,
	medal.medal
ORDER BY
	mtot DESC
	
-----
--table (--réduite) + géom
DROP TABLE jomedgeom
CREATE TABLE jomedgeom AS (SELECT 
	jomed.code, year, season, sum(mtot) as mall, --ST_AsGeoJSON(country.geometry)::json AS geometry, --sport, --country.geometry, 
	sum(CASE WHEN medal ILIKE 'Gold' THEN mtot ELSE '0' END) as mg,
	sum(CASE WHEN medal ILIKE 'Silver' THEN mtot ELSE '0' END) as ms,
	sum(CASE WHEN medal ILIKE 'Bronze' THEN mtot ELSE '0' END) as mb
FROM 
	jomed
INNER JOIN country ON jomed.code = country.code
--WHERE
--	year = 1980 AND season LIKE 'Summer' --AND sport like 'Boxing'
GROUP BY
	jomed.code, year, season --country.geometry--, sport, country.geometry)
);
	
	
	
--table réduite + géom + sport
DROP TABLE jomedsportgeom
CREATE TABLE jomedsportgeom AS (SELECT 
	jomed.code, year, season, sum(mtot) as mall, sport,--ST_AsGeoJSON(country.geometry)::json AS geometry, sport,
	sum(CASE WHEN medal ILIKE 'Gold' THEN mtot ELSE '0' END) as mg,
	sum(CASE WHEN medal ILIKE 'Silver' THEN mtot ELSE '0' END) as ms,
	sum(CASE WHEN medal ILIKE 'Bronze' THEN mtot ELSE '0' END) as mb
FROM 
	jomed
INNER JOIN country ON jomed.code = country.code
--WHERE
--	year = 1980 AND season LIKE 'Summer' --AND sport like 'Boxing'
GROUP BY
	jomed.code, year, season, sport--country.geometry, sport --country.geometry)
);


--table pays
DROP TABLE countryjson
CREATE TABLE countryjson AS (SELECT code, ST_AsGeoJSON(geometry)::json AS geometry FROM country)
	
SELECT * FROM jomedgeom INNER JOIN countryjson ON jomedgeom.code = countryjson.code WHERE year = 1980 AND season LIKE 'Summer'
SELECT * FROM jomedsportgeom INNER JOIN countryjson ON jomedsportgeom.code = countryjson.code WHERE year = 1980 AND season LIKE 'Summer' AND sport LIKE 'Boxing'

*****
--table réduite + géom en geoJSON
SELECT jsonb_build_object(
  'type',     'FeatureCollection',
  'features', jsonb_agg(feature)
)
FROM (
  SELECT jsonb_build_object(
    'type',       'Feature',
    'id',         code,
    'geometry',   ST_AsGeoJSON(geometry)::jsonb,
    'properties', to_jsonb(inputs) - 'code' - 'geometry'
  ) AS feature
  FROM (
    SELECT 
	jomed.code, year, sum(mtot) as mall, country.geometry,  
	sum(CASE WHEN medal ILIKE 'Gold' THEN mtot ELSE '0' END) as mg,
	sum(CASE WHEN medal ILIKE 'Silver' THEN mtot ELSE '0' END) as ms,
	sum(CASE WHEN medal ILIKE 'Bronze' THEN mtot ELSE '0' END) as mb
FROM 
	jomed
INNER JOIN country ON jomed.code = country.code
WHERE
	year = 1980 AND season LIKE 'Summer' 
GROUP BY
	jomed.code, year, country.geometry
  ) inputs
) features;

--, sport, country.geometry --sport, --country.geometry, --AND sport like 'Boxing'

--en ligne
SELECT jsonb_build_object('type', 'FeatureCollection', 'features', jsonb_agg(feature)) FROM (SELECT jsonb_build_object('type', 'Feature', 'id', code, 'geometry', ST_AsGeoJSON(geometry)::jsonb,'properties', to_jsonb(inputs) - 'code' - 'geometry') AS feature FROM (SELECT jomed.code, year, sum(mtot) as mall, country.geometry, sum(CASE WHEN medal ILIKE 'Gold' THEN mtot ELSE '0' END) as mg, sum(CASE WHEN medal ILIKE 'Silver' THEN mtot ELSE '0' END) as ms, sum(CASE WHEN medal ILIKE 'Bronze' THEN mtot ELSE '0' END) as mb FROM jomed INNER JOIN country ON jomed.code = country.code WHERE year = 1980 AND season LIKE 'Summer' GROUP BY jomed.code, year, country.geometry) inputs) features;
	------------



CREATE TABLE jomedgeojson AS (
	SELECT 
		'Feature' AS type, 
		(SELECT row_to_json(jomedgeom) FROM (SELECT code, year, season, mall, mg, ms, mb) tt) AS properties,
		ST_AsGeoJSON(geometry)::json AS geometry
	FROM jomedgeom)
);
```
