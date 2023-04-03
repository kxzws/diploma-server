import { connection } from "../index.js";

// топ-3 юзеров
export const getRating = (_, res) => {
  const sql = `SELECT DISTINCT userName as user, donateAmount as amount FROM donates
  JOIN users ON donates.idUser = users.idUser
  ORDER BY donateAmount DESC
  LIMIT 3;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};
