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

