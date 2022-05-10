const {
  Document,
  Packer,
  Paragraph,
  AlignmentType,
  HeadingLevel,
  TextRun,
} = require("docx");

const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const path = require("path");
const backupFilePath = path.join(__dirname, "backup.txt");
const receiptFilePath = path.join(__dirname, "receipt.docx");
const fs = require("fs");
const backupStream = fs.createWriteStream(backupFilePath, { flags: "w" });
const receiptStream = fs.createWriteStream(receiptFilePath, { flags: "w" });

const connection = mysql2
  .createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "kursach",
    multipleStatements: true,
  })
  .promise();

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors());

// бэкап
app.get("/backup", (req, res) => {
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
});

// топ-3 юзеров
app.get("/rating", (req, res) => {
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
});

// получение всех птиц с сортировкой
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
  const sql = `SELECT idSpecies as num, speciesName as title, internationalName as interTitle,
  shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description
  FROM birdSpecies
  JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
  JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
  ORDER BY speciesName ${sortType};`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

// получение конкретных птиц по поиску с сортировкой
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
  const sql = `SELECT idSpecies as num, speciesName as title, internationalName as interTitle,
  shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description
  FROM birdSpecies
  JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
  JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
  WHERE LOWER(speciesName) REGEXP LOWER(?)
  ORDER BY speciesName ${sortType};`;

  connection
    .query(sql, req.params.bird)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

// получение всех заповедников
app.get("/preserves", (req, res) => {
  const sql = `SELECT idPres as num, presName, presOwner, area, foundYear, address FROM preserves;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

// получение всех родов птиц
app.get("/genuses", (req, res) => {
  const sql = `SELECT idGenus as num, genusName FROM birdGenus;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

// получение всех защитных статусов
app.get("/statuses", (req, res) => {
  const sql = `SELECT idPrS as num, longName FROM protectionStatus;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

// отправка доната в бд
app.post("/donate", (req, res) => {
  const speciesId = req.body.species;
  const speciesStr = speciesId.reduce((acc, curr) => `${acc}, ${curr}`);
  const preserveId = req.body.preserve;
  const amount = req.body.amount;
  const nickname = req.body.nick;
  const sql = `INSERT INTO donates (idUser, idPreserves2birdSpecies, donateDate, donateAmount)
  (SELECT (SELECT idUser FROM users
  WHERE userName = '${nickname}'),
  db.idPres2Spec,
  NOW(), ${amount} FROM birdSpecies
  JOIN (SELECT idPreserves2birdSpecies as idPres2Spec, idSpecies FROM preserves2birdSpecies
  WHERE idPres = ${preserveId} AND idSpecies IN (${speciesStr})) db ON db.idSpecies = birdSpecies.idSpecies);`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Чек пользователя ",
                bold: true,
              }),
              new TextRun({
                text: nickname.toString(),
                italics: true,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun("на сумму " + amount.toString() + " USD,")],
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun(
                "отправленную видам под следующими индексами: " +
                  speciesStr.toString() +
                  ","
              ),
            ],
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun(
                "находящимся в заповеднике с индексом " + preserveId.toString()
              ),
            ],
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });
  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("receipt.docx", buffer);
  });
});

// отправка нового вида птиц в бд
app.post("/add-species", (req, res) => {
  const name = req.body.name.trim();
  const length = req.body.length ? req.body.length : null;
  const weight = req.body.weight ? req.body.weight : null;
  const wingspan = req.body.wingspan ? req.body.wingspan : null;
  const descr = req.body.descr ? req.body.descr : null;
  const genusId = req.body.genusId;
  const protectStatusId = req.body.protectStatusId;
  const preserveId = req.body.preserveId;

  const description = descr ? `'${descr}'` : null;
  const sql = `INSERT INTO birdSpecies (speciesName, length, weight, wingspan, description, idGenus, idPrS) VALUES
  ('${name}', ${length}, ${weight}, ${wingspan}, ${description}, ${genusId}, ${protectStatusId});
  INSERT INTO preserves2birdSpecies (idSpecies, idPres)
  (SELECT idSpecies, ${preserveId} FROM birdSpecies
  WHERE speciesName REGEXP '^${name}$');`;

  connection
    .query(sql)
    .then((result) => {
      res.json([result[0], result[1]]);
    })
    .catch((err) => {
      res.json(err);
    });
});

// удаление выбранного вида птиц в бд
app.delete("/delete-species/:id", (req, res) => {
  const speciesId = req.params.id;
  const sql = `DELETE FROM preserves2birdSpecies
  WHERE idSpecies = ${speciesId};
  DELETE FROM birdSpecies 
  WHERE idSpecies = ${speciesId};`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
});

// проверка верности пароля
app.post("/login", (req, res) => {
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
});

// регистрация пользователя
app.post("/register", (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
