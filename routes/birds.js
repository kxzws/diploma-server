import fs from "fs";
import docxPkg from "docx";

import { connection } from "../index.js";

/* ***************************** GET */

// получение всех птиц с сортировкой
export const getAllBirds = (req, res) => {
  const sortType = req.params.sort === "DESC" ? "DESC" : "ASC";
  const { pres } = req.params;

  const sql = `SELECT birdSpecies.idSpecies as num, speciesName as title, internationalName as interTitle,
  shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description,
  protectionStatus.maintenanceCost as protectStatusCost, a.presName, preserves.speciesRepresQty as speciesRepresQty,
  GROUP_CONCAT(donates.donateAmount SEPARATOR ',') as donates,
  a.annualStateBudget + a.donateAmount as presIncome, a.staffCost + a.speciesCost as presExpenses
  FROM birdSpecies
  JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
  JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
  JOIN preserves2birdspecies ON preserves2birdspecies.idSpecies = birdSpecies.idSpecies
  JOIN preserves ON preserves.idPres = preserves2birdspecies.idPres
  CROSS JOIN (
    SELECT preserves.idPres, preserves.presName, annualStateBudget, IF(SUM(donateAmount) > 0, SUM(donateAmount), 0) as donateAmount, 
    staffQty * staffPersonCost as staffCost, SUM(speciesRepresQty * maintenanceCost) as speciesCost FROM preserves
    LEFT JOIN preserves2birdSpecies ON preserves2birdSpecies.idPres = preserves.idPres
    LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
    LEFT JOIN birdSpecies ON birdSpecies.idSpecies = preserves2birdSpecies.idSpecies
    LEFT JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
    GROUP BY presName
    ) as a ON a.idPres = preserves.idPres
  LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
  WHERE preserves.idPres = ${pres}
  GROUP BY birdSpecies.idSpecies
  ORDER BY speciesName ${sortType};`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};

// получение конкретных птиц по поиску с сортировкой
export const getSearchedBirds = (req, res) => {
  const sortType = req.params.sort === "DESC" ? "DESC" : "ASC";
  const { pres } = req.params;

  const sql = `SELECT birdSpecies.idSpecies as num, speciesName as title, internationalName as interTitle,
  shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description,
  protectionStatus.maintenanceCost as protectStatusCost, a.presName, preserves.speciesRepresQty as speciesRepresQty,
  GROUP_CONCAT(donates.donateAmount SEPARATOR ',') as donates,
  a.annualStateBudget + a.donateAmount as presIncome, a.staffCost + a.speciesCost as presExpenses
  FROM birdSpecies
  JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
  JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
  JOIN preserves2birdspecies ON preserves2birdspecies.idSpecies = birdSpecies.idSpecies
  JOIN preserves ON preserves.idPres = preserves2birdspecies.idPres
  CROSS JOIN (
    SELECT preserves.idPres, preserves.presName, annualStateBudget, IF(SUM(donateAmount) > 0, SUM(donateAmount), 0) as donateAmount, 
    staffQty * staffPersonCost as staffCost, SUM(speciesRepresQty * maintenanceCost) as speciesCost FROM preserves
    LEFT JOIN preserves2birdSpecies ON preserves2birdSpecies.idPres = preserves.idPres
    LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
    LEFT JOIN birdSpecies ON birdSpecies.idSpecies = preserves2birdSpecies.idSpecies
    LEFT JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
    GROUP BY presName
    ) as a ON a.idPres = preserves.idPres
  LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
  WHERE LOWER(speciesName) REGEXP LOWER(?) AND preserves.idPres = ${pres}
  GROUP BY birdSpecies.idSpecies
  ORDER BY speciesName ${sortType};`;

  connection
    .query(sql, req.params.bird)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};

// получение птицы по номеру
export const getBirdByNum = (req, res) => {
  const { num } = req.params;

  const sql = `SELECT birdSpecies.idSpecies as num, speciesName as title, internationalName as interTitle,
  shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description,
  protectionStatus.maintenanceCost as protectStatusCost, a.presName, preserves.speciesRepresQty as speciesRepresQty,
  a.annualStateBudget + a.donateAmount as presIncome, a.staffCost + a.speciesCost as presExpenses
  FROM birdSpecies
  JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
  JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
  JOIN preserves2birdspecies ON preserves2birdspecies.idSpecies = birdSpecies.idSpecies
  JOIN preserves ON preserves.idPres = preserves2birdspecies.idPres
  CROSS JOIN (
    SELECT preserves.idPres, preserves.presName, annualStateBudget, IF(SUM(donateAmount) > 0, SUM(donateAmount), 0) as donateAmount, 
    staffQty * staffPersonCost as staffCost, SUM(speciesRepresQty * maintenanceCost) as speciesCost FROM preserves
    LEFT JOIN preserves2birdSpecies ON preserves2birdSpecies.idPres = preserves.idPres
    LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
    LEFT JOIN birdSpecies ON birdSpecies.idSpecies = preserves2birdSpecies.idSpecies
    LEFT JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
    GROUP BY presName
    ) as a ON a.idPres = preserves.idPres
  WHERE birdSpecies.idSpecies = ${num};`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};

// получение всех родов птиц
export const getBirdsGenuses = (_, res) => {
  const sql = `SELECT idGenus as num, genusName FROM birdGenus;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};

// получение всех защитных статусов
export const getBirdsStatuses = (_, res) => {
  const sql = `SELECT idPrS as num, longName FROM protectionStatus;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};

/* ***************************** POST */

// отправка доната в бд
export const donateToBirds = (req, res) => {
  const speciesId = req.body.species;
  const speciesStr = speciesId.reduce((acc, curr) => `${acc}, ${curr}`);

  const preserveId = req.body.preserve;
  const nickname = req.body.nick;

  const { amount } = req.body;

  const sql = `INSERT INTO donates (idUser, idPreserves2birdSpecies, donateDate, donateAmount)
  (SELECT (SELECT idUser FROM users
  WHERE userName = '${nickname}'),
  db.idPres2Spec,
  NOW(), ${(amount / speciesId.length).toFixed(3)} FROM birdSpecies
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

  const doc = new docxPkg.Document({
    sections: [
      {
        children: [
          new docxPkg.Paragraph({
            children: [
              new docxPkg.TextRun({
                text: "Чек пользователя ",
                bold: true,
              }),
              new docxPkg.TextRun({
                text: nickname.toString(),
                italics: true,
              }),
            ],
            heading: docxPkg.HeadingLevel.HEADING_1,
            alignment: docxPkg.AlignmentType.CENTER,
          }),
          new docxPkg.Paragraph({
            children: [
              new docxPkg.TextRun("на сумму " + amount.toString() + " USD,"),
            ],
            heading: docxPkg.HeadingLevel.HEADING_2,
            alignment: docxPkg.AlignmentType.CENTER,
          }),
          new docxPkg.Paragraph({
            children: [
              new docxPkg.TextRun(
                "отправленную видам под следующими индексами: " +
                  speciesStr.toString() +
                  ","
              ),
            ],
            heading: docxPkg.HeadingLevel.HEADING_3,
            alignment: docxPkg.AlignmentType.CENTER,
          }),
          new docxPkg.Paragraph({
            children: [
              new docxPkg.TextRun(
                "находящимся в заповеднике с индексом " + preserveId.toString()
              ),
            ],
            heading: docxPkg.HeadingLevel.HEADING_3,
            alignment: docxPkg.AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });
  docxPkg.Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("receipt.docx", buffer);
  });
};

// отправка нового вида птиц в бд
export const addBirdSpecies = (req, res) => {
  const name = req.body.name.trim();
  const length = req.body.length ? req.body.length : null;
  const weight = req.body.weight ? req.body.weight : null;
  const wingspan = req.body.wingspan ? req.body.wingspan : null;
  const descr = req.body.descr ? req.body.descr : null;
  const description = descr ? `'${descr}'` : null;

  const { genusId, protectStatusId, preserveId } = req.body;

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
};

/* ***************************** DELETE */

// удаление выбранного вида птиц в бд
export const deleteBirdSpecies = (req, res) => {
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
};
