const { Endpoint } = require("./endpoint")
const fs = require("fs");
const {
  queryRegions,
  queryCities,
  queryOrganizations,
  queryNationalities,
  queryWeaponTypes,
  queryTargets,
  queryWeapon,
} = require("../queries");

class StatEndpoint extends Endpoint {
    async get(_, res) {
        Promise.all([
            queryRegions(),
            queryTargets(),
            queryNationalities(),
            queryWeaponTypes(),
            queryWeapon(),
          ])
            .then(
              ([
                regionRows,
                targetRows,
                nationalityRows,
                weaponTypeRows,
                weaponRows,
              ]) => {
                // --------------------- Generate the options markup for REGIONS -----------------------------
                const regions = regionRows.map((row, index) => {
                  return { id: index + 1, name: row.region };
                });

                const regionsOptionsMarkup = regions
                  .map(
                    (region) => `<option value="${region.id}">${region.name}</option>`
                  )
                  .join("");
        
                // --------------------- Generate the options markup for TARGETS -----------------------------------
                const targets = targetRows.map((row, index) => {
                  return { id: index + 1, name: row.targtype };
                });

                const targetsOptionsMarkup = targets
                  .map(
                    (target) => `<option value="${target.id}">${target.name}</option>`
                  )
                  .join("");
        
                // --------------------- Generate the options markup for NATIONALITIES -------------------------
                const nationalities = nationalityRows.map((row, index) => {
                  return { id: index + 1, name: row.country };
                });

                const nationalitiesOptionsMarkup = nationalities
                  .map(
                    (nationality) =>
                      `<option value="${nationality.id}">${nationality.name}</option>`
                  )
                  .join("");
        
                // ----------------------- Generate the options markup for WEAPON TYPES ------------------------------
                const weaponTypes = weaponTypeRows.map((row, index) => {
                  return { id: index + 1, name: row.weapon_type };
                });
                const weaponTypesOptionsMarkup = weaponTypes
                  .map(
                    (weaponType) =>
                      `<option value="${weaponType.id}">${weaponType.name}</option>`
                  )
                  .join("");
        
                // -------------------------- Generate the options markup for WEAPONS ----------------------------
                const weapons = weaponRows.map((row, index) => {
                  return { id: index + 1, name: row.weapon };
                });
                const weaponOptionsMarkup = weapons
                  .map(
                    (weapon) => `<option value="${weapon.id}">${weapon.name}</option>`
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
                    .replace("{{weaponsOptions}}", weaponOptionsMarkup);
        
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
}

module.exports = {StatEndpoint};