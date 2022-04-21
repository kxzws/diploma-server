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

connection
  .query(
    "SELECT idSpecies, speciesName, internationalName, shortName, weight, wingspan, birdSpecies.description FROM birdSpecies JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus;"
  )
  .then((result) => {
    console.log(result);
    console.log(result[0]);
  })
  .catch((err) => {
    console.log(err);
  });

// connection.connect(function (err) {
//   if (err) {
//     return console.error("Ошибка подключения: " + err.message);
//   } else {
//     console.log("Подключение к серверу MySQL успешно установлено");
//   }
// });

// connection.end(function (err) {
//   if (err) {
//     return console.log("Ошибка закрытия подключения: " + err.message);
//   }
//   console.log("Подключение закрыто");
// });

module.export = connection;
