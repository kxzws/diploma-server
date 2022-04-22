const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const app = express();
const port = 3000;

const connection = mysql2
  .createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "kursach",
  })
  .promise();

app.use(cors());

app.get("/birds/:sort", (req, res) => {
  let sortType;
  switch (req.params.sort) {
    case "ASC":
      sortType = "ASC";
      break;
    case "DESC":
      sortType = "DESC";
      break;
  }
  const sql = `SELECT idSpecies as num, speciesName as title, internationalName as interTitle, shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description FROM birdSpecies JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus ORDER BY speciesName ${sortType};`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/birds/:bird/:sort", (req, res) => {
  let sortType;
  switch (req.params.sort) {
    case "ASC":
      sortType = "ASC";
      break;
    case "DESC":
      sortType = "DESC";
      break;
  }
  const sql = `SELECT idSpecies as num, speciesName as title, internationalName as interTitle, shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description FROM birdSpecies JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus WHERE LOWER(speciesName) REGEXP LOWER(?) ORDER BY speciesName ${sortType};`;

  connection
    .query(sql, req.params.bird)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
