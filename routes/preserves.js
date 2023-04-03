import { connection } from "../index.js";

// получение всех заповедников
export const getAllPreserves = (_, res) => {
  const sql = `SELECT idPres as num, presName, presOwner, area, foundYear, address FROM preserves;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};
