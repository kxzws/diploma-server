import { connection } from "../index.js";

// финансы
export const getFinances = (_, res) => {
  const sql = `SELECT presName, annualStateBudget, IF(SUM(donateAmount) > 0, SUM(donateAmount), 0) as donateAmount, staffQty * staffPersonCost as staffCost,
  SUM(speciesRepresentativesQty * maintenanceCost) as speciesCost FROM preserves
  LEFT JOIN preserves2birdSpecies ON preserves2birdSpecies.idPres = preserves.idPres
  LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
  LEFT JOIN birdSpecies ON birdSpecies.idSpecies = preserves2birdSpecies.idSpecies
  LEFT JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
  GROUP BY presName;`;

  connection
    .query(sql)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.json(err);
    });
};
