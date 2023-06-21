const TerroDBConnection = require('./DBConnection.js');

function queryRegions() {
  return TerroDBConnection.query('select region from regions')
    .then((rows) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function queryCities() {
  return TerroDBConnection.query('select distinct city from attacks')
    .then((rows) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function queryOrganizations() {
  return TerroDBConnection.query('select * from organizations')
    .then((rows) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function queryNationalities() {
  return TerroDBConnection.query('select country from countries')
    .then((rows) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function queryWeaponTypes() {
  return TerroDBConnection.query('select weapon_type from weapon_types')
    .then((rows) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function queryTargets() {
  return TerroDBConnection.query('select targtype from targtypes')
    .then((rows) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

module.exports = {
  queryRegions,
  queryCities,
  queryOrganizations,
  queryNationalities,
  queryWeaponTypes,
  queryTargets
};