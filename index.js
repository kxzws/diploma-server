import express from "express";
import cors from "cors";
import mysql2 from "mysql2";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

import {
  getAllBirds,
  getSearchedBirds,
  getBirdsGenuses,
  getBirdsStatuses,
  donateToBirds,
  addBirdSpecies,
  deleteBirdSpecies,
} from "./routes/birds.js";
import { getAllPreserves } from "./routes/preserves.js";
import { registerUser, loginUser } from "./routes/users.js";
import { makeBackup } from "./routes/backup.js";
import { getFinances } from "./routes/finance.js";
import { getRating } from "./routes/rating.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backupFilePath = path.join(__dirname, "backup.txt");
export const backupStream = fs.createWriteStream(backupFilePath, {
  flags: "w",
});

const port = 3000;
export const app = express();
export const connection = mysql2
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

app.get("/birds/:sort", getAllBirds);
app.get("/birds/:bird/:sort", getSearchedBirds);
app.get("/genuses", getBirdsGenuses);
app.get("/statuses", getBirdsStatuses);
app.get("/donate", donateToBirds);
app.get("/add-species", addBirdSpecies);
app.get("/delete-species/:id", deleteBirdSpecies);

app.use("/preserves", getAllPreserves);

app.use("/register", registerUser);
app.use("/login", loginUser);

app.use("/backup", makeBackup);

app.use("/finance", getFinances);

app.use("/rating", getRating);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
