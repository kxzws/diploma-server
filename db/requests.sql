-- все птицы
SELECT birdSpecies.idSpecies as num, speciesName as title, internationalName as interTitle,
shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description,
protectionStatus.maintenanceCost as protectStatusCost, preserves.speciesRepresQty as speciesRepresQty,
preserves.annualStateBudget as presAnnualBudget
FROM birdSpecies
JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
JOIN preserves2birdspecies ON preserves2birdspecies.idSpecies = birdSpecies.idSpecies
JOIN preserves ON preserves.idPres = preserves2birdspecies.idPres
WHERE preserves.idPres = 1
ORDER BY speciesName ASC;


-- все заповедники
SELECT idPres as num, presName, presOwner, area, foundYear, address FROM preserves;


SET @input_parameter := 'орл';
-- поиск по названию
SELECT idSpecies as num, speciesName as title, internationalName as interTitle, shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description FROM birdSpecies
JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
WHERE LOWER(speciesName) REGEXP LOWER(@input_parameter);


-- вставка с известными primary keys видов, заповедника, размера доната и никнейма
INSERT INTO donates (idUser, idPreserves2birdSpecies, donateDate, donateAmount)
(SELECT (SELECT idUser FROM users
WHERE userName = @nick),
db.idPres2Spec,
NOW(), @amount FROM birdSpecies
JOIN (SELECT idPreserves2birdSpecies as idPres2Spec, idSpecies FROM preserves2birdSpecies
WHERE idPres = @pres AND idSpecies IN (1, 3, 5)) db ON db.idSpecies = birdSpecies.idSpecies);
SELECT * FROM donates;

SET @species := '1, 3, 5';
SET @pres := 1;
SET @amount := 666;
SET @nick := 'kxzws';

SELECT (SELECT idUser FROM users
WHERE userName = @nick),
db.idPres2Spec,
NOW(), @amount FROM birdSpecies
JOIN (SELECT idPreserves2birdSpecies as idPres2Spec, idSpecies FROM preserves2birdSpecies
WHERE idPres = @pres AND idSpecies IN (1, 3, 5)) db ON db.idSpecies = birdSpecies.idSpecies;


SET @pass := '12345679';
-- проверка верности пароля к юзеру
SELECT userName, isAdmin FROM users
WHERE userName = @nick AND userPass = md5(@pass);


-- вставка нового вида птиц к существующему роду
INSERT INTO birdSpecies (speciesName, length, weight, wingspan, description, idGenus, idPrS) VALUES
('Милый', 1, 125, 2, 'Такой', 4, 1);
INSERT INTO preserves2birdSpecies (idSpecies, idPres)
(SELECT idSpecies, 4 FROM birdSpecies
WHERE speciesName REGEXP '^Милый$');

-- удаление определённого вида птиц
DELETE FROM preserves2birdSpecies
WHERE idSpecies = 13;
DELETE FROM birdSpecies 
WHERE idSpecies = 13;

SELECT * FROM birdSpecies;
SELECT * FROM preserves2birdSpecies;

-- топ-3 донатеров
SELECT DISTINCT userName as user, donateAmount as amount FROM donates
JOIN users ON donates.idUser = users.idUser
ORDER BY donateAmount DESC
LIMIT 3;

-- финансовая статистика
SELECT preserves.idPres, presName, annualStateBudget, IF(SUM(donateAmount) > 0, SUM(donateAmount), 0) as donateAmount, staffQty * staffPersonCost as staffCost,
SUM(speciesRepresQty * maintenanceCost) as speciesCost FROM preserves
LEFT JOIN preserves2birdSpecies ON preserves2birdSpecies.idPres = preserves.idPres
LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
LEFT JOIN birdSpecies ON birdSpecies.idSpecies = preserves2birdSpecies.idSpecies
LEFT JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
GROUP BY presName;

-- выборка с данными для автоматизации
SELECT birdSpecies.idSpecies as num, speciesName as title, internationalName as interTitle,
shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description,
GROUP_CONCAT(donates.donateAmount SEPARATOR ',') as donates,
a.annualStateBudget + a.donateAmount as presIncome, a.staffCost + a.speciesCost as presExpenses
FROM birdSpecies
JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
JOIN preserves2birdspecies ON preserves2birdspecies.idSpecies = birdSpecies.idSpecies
JOIN preserves ON preserves.idPres = preserves2birdspecies.idPres
LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdspecies.idPreserves2birdSpecies
CROSS JOIN (
SELECT preserves.idPres, annualStateBudget, IF(SUM(donateAmount) > 0, SUM(donateAmount), 0) as donateAmount, 
staffQty * staffPersonCost as staffCost, SUM(speciesRepresQty * maintenanceCost) as speciesCost FROM preserves
LEFT JOIN preserves2birdSpecies ON preserves2birdSpecies.idPres = preserves.idPres
LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
LEFT JOIN birdSpecies ON birdSpecies.idSpecies = preserves2birdSpecies.idSpecies
LEFT JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
GROUP BY presName
) as a ON a.idPres = preserves.idPres
WHERE preserves.idPres = 1
GROUP BY birdSpecies.idSpecies
ORDER BY speciesName ASC;

-- выборка для определенного вида по всем заповедникам
SELECT birdSpecies.idSpecies as num, speciesName as title, internationalName as interTitle,
shortName as protectStatus, longName as abbr, length, weight, wingspan, birdSpecies.description as description,
protectionStatus.maintenanceCost as protectStatusCost, preserves.speciesRepresQty as speciesRepresQty,
a.annualStateBudget + a.donateAmount as presIncome, a.staffCost + a.speciesCost as presExpenses
FROM birdSpecies
JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
JOIN birdGenus ON birdGenus.idGenus = birdSpecies.idGenus
JOIN preserves2birdspecies ON preserves2birdspecies.idSpecies = birdSpecies.idSpecies
JOIN preserves ON preserves.idPres = preserves2birdspecies.idPres
CROSS JOIN (
  SELECT preserves.idPres, annualStateBudget, IF(SUM(donateAmount) > 0, SUM(donateAmount), 0) as donateAmount, 
  staffQty * staffPersonCost as staffCost, SUM(speciesRepresQty * maintenanceCost) as speciesCost FROM preserves
  LEFT JOIN preserves2birdSpecies ON preserves2birdSpecies.idPres = preserves.idPres
  LEFT JOIN donates ON donates.idPreserves2birdSpecies = preserves2birdSpecies.idPreserves2birdSpecies
  LEFT JOIN birdSpecies ON birdSpecies.idSpecies = preserves2birdSpecies.idSpecies
  LEFT JOIN protectionStatus ON protectionStatus.idPrS = birdSpecies.idPrS
  GROUP BY presName
  ) as a ON a.idPres = preserves.idPres
WHERE birdSpecies.idSpecies = 1;
