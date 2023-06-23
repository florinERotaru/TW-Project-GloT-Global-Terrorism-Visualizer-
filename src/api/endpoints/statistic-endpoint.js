const { Endpoint } = require("./endpoint");
const fs = require("fs");
const querystring = require("querystring");
const {
  queryRegions,
  queryNationalities,
  queryWeaponTypes,
  queryTargets,
  queryAttackTypes,
} = require("../queries");
const { validate } = require("uuid");
//const TerroDBConnection = require("../DBConnection");
const sessionsManager = require('../sessionManager');

var weaponValues = [];
var regionValues = [];
var attackTypeValues = [];
var targetValues = [];
var nationalityValues = [];

class StatEndpoint extends Endpoint {
  async get(req, res) {
    let flag = await sessionsManager(req);
      if (flag == false) {
        console.log("FALS");
        res.setHeader("Location", "/login");
        res.statusCode = 302;
        res.end();
      }
      else {
        if (req.url === "/api/stat") {
          Promise.all([
            queryRegions(),
            queryTargets(),
            queryNationalities(),
            queryWeaponTypes(),
            queryAttackTypes(),
          ])
            .then(
              ([
                regionRows,
                targetRows,
                nationalityRows,
                weaponTypeRows,
                attackTypesRows,
              ]) => {
                // --------------------- Generate the options markup for REGIONS -----------------------------
                const regions = regionRows.map((row, index) => {
                  regionValues[index + 1] = row.region;
                  return { id: row.id, name: row.region };
                });

                const regionsOptionsMarkup = regions
                  .map(
                    (region) =>
                      `<option value="${region.id}">${region.name}</option>`
                  )
                  .join("");

                // --------------------- Generate the options markup for TARGETS -----------------------------------
                const targets = targetRows.map((row, index) => {
                  targetValues[index + 1] = row.targtype;
                  return { id: index + 1, name: row.targtype };
                });

                const targetsOptionsMarkup = targets
                  .map(
                    (target) =>
                      `<option value="${target.id}">${target.name}</option>`
                  )
                  .join("");

                // --------------------- Generate the options markup for NATIONALITIES -------------------------
                const nationalities = nationalityRows.map((row, index) => {
                  nationalityValues[index + 1] = row.country;
                  return { id: row.id, name: row.country };
                });

                const nationalitiesOptionsMarkup = nationalities
                  .map(
                    (nationality) =>
                      `<option value="${nationality.id}">${nationality.name}</option>`
                  )
                  .join("");

                // ----------------------- Generate the options markup for WEAPON TYPES ------------------------------
                const weaponTypes = weaponTypeRows.map((row, index) => {
                  attackTypeValues[index + 1] = row.weapon_type;
                  return { id: row.id, name: row.weapon_type };
                });
                const weaponTypesOptionsMarkup = weaponTypes
                  .map(
                    (weaponType) =>
                      `<option value="${weaponType.id}">${weaponType.name}</option>`
                  )
                  .join("");

                const attackTypes = attackTypesRows.map((row) => {
                  return { id: row.id, name: row.attacktype };
                });
                const attackTypesMarkup = attackTypes
                  .map(
                    (attackType) =>
                      `<option value="${attackType.id}">${attackType.name}</option>`
                  )
                  .join("");

                // Read the HTML file
                fs.readFile("../view/index.html", "utf8", (err, data) => {
                  if (err) {
                    res.statusCode = 500;
                    res.end("Internal Server Error");
                    return;
                  }

                  // Replace the placeholders in the HTML content with the generated options markup
                  const modifiedData = data
                    .replace("{{regionsOptions}}", regionsOptionsMarkup)
                    .replace("{{targetsOptions}}", targetsOptionsMarkup)
                    .replace("{{nationalitiesOptions}}", nationalitiesOptionsMarkup)
                    .replace("{{weaponTypesOptions}}", weaponTypesOptionsMarkup)
                    .replace("{{attackTypesOption}}", attackTypesMarkup); //

                  // Send the modified HTML content as the response
                  res.setHeader("Content-Type", "text/html");
                  res.end(modifiedData);
                });
              }
            )
            .catch((error) => {
              // Handle the error
              console.log("Error:", error);
              res.statusCode = 500;
              res.end("Internal Server Error");
            });
        }

        //------------ Generate Chart ---------------------
        else if (req.url.includes("/stat?")) {
          //console.log("THE Weapons: ", weaponValues);
          console.log("AM AJUNS IN STAT: ", req.url);
          const urlObj = new URL(`http://${req.headers.host}${req.url}`);
          console.log("URELE: ", urlObj);
          const queryParams = urlObj.searchParams;
          console.log("MY_Query: ", queryParams);
          //Get the values for the filters:
          const mainWeaponIndex = queryParams.get("main-weapon");
          const regionIndex = queryParams.get("region"); //region_id
          const targetIndex = queryParams.get("main-target"); //victims.target_id
          const attackIndex = queryParams.get("attack-type"); //
          const nationalityIndex = queryParams.get("main-nationality"); //victims.ntlty_id
          const chartIndex = queryParams.get("chart");
          //console.log("REGION ID: ", regionIndex);

          //-------------------------------------------------------------------------------

          //const values = [weapon, region, target, attacktype, nationality];

          let query =
            "select * from attacks join victims on attacks.id = victims.attack_id where 1=1 ";
          let argCtr = 1;
          let values = [];

          if (mainWeaponIndex && mainWeaponIndex != -1) {
            query += "AND attacks.weapon_type_id=$" + argCtr;
            argCtr++;
            values.push(mainWeaponIndex);
          }
          if (regionIndex && regionIndex != -1) {
            query += " AND attacks.region_id=$" + argCtr;
            argCtr++;
            values.push(regionIndex);
          }
          if (targetIndex && targetIndex != -1) {
            query += " AND victims.target_id=$" + argCtr;
            argCtr++;
            values.push(targetIndex);
          }
          if (attackIndex && attackIndex != -1) {
            query += " AND attacks.attacktype_id=$" + argCtr;
            argCtr++;
            values.push(attackIndex);
          }
          if (nationalityIndex && nationalityIndex != -1) {
            query += " AND victims.ntlty_id=$" + argCtr;
            argCtr++;
            values.push(nationalityIndex);
          }
          console.log("QUERYY: ", query);

          //weap, attac, targ, nationS
          const TerrorDBConnection = require("../DBConnection.js");
          console.log("INAINE DE QUERY!!!");
          var lenght = 10000;
          //console.log("VALUES TO QUERY: ", values);
          await TerrorDBConnection.query(query, values)
            .then((rows) => {
              if (rows.length > 0) {
                console.log("ROWS: ", rows);
                lenght = rows.length;
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(rows));
              }
            })
            .catch((error) => {
              lenght = 999;
              console.log("ERROR DUPA QUERY: ", error);
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("An error occurred.");
            });

          console.log("LENNNN: ", lenght);
        }
    }
  }
}
module.exports = { StatEndpoint };