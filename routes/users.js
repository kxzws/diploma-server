import { connection } from "../index.js";

// регистрация пользователя
export const registerUser = (req, res) => {
  const nickname = req.body.nick.trim();
  const password = req.body.pass.trim();
  const email = req.body.mail.trim();
  const telephone = req.body.phone.trim();

  const sql = `INSERT INTO users (userName, userPass, isAdmin, email, phoneNumber) VALUES
  ('${nickname}', md5('${password}'), false, '${email}', '${telephone}');`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};

// проверка верности пароля
export const loginUser = (req, res) => {
  const nickname = req.body.nick.trim();
  const password = req.body.pass.trim();

  const sql = `SELECT userName, isAdmin FROM users
  WHERE userName = '${nickname}' AND userPass = md5('${password}');`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};
