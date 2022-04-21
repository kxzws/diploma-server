const express = require("express");
const app = express();
const port = 3000;
const mysql2 = require("mysql2");

const connection = mysql2
  .createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "kursach",
  })
  .promise();

app.get("/birds", (req, res) => {
  connection
  .query(
    "SELECT idSpecies, speciesName, internationalName, shortName, weight, wingspan, birdSpecies.description FROM birdSpecies JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus;"
  )
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

// http://localhost:3000/

// SELECT idSpecies, speciesName, internationalName, shortName, weight, wingspan, birdSpecies.description FROM birdSpecies JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus;
