import { connection, backupStream } from "../index.js";

// бэкап
export const makeBackup = (_, res) => {
  const sql = `SELECT idSpecies as num, speciesName as title, internationalName as interTitle,
  shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description
  FROM birdSpecies
  JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
  JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
  ORDER BY idSpecies;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
      const backup = JSON.stringify(result[0]);
      backupStream.write(backup);
    })
    .catch((err) => {
      res.json(err);
    });
};
