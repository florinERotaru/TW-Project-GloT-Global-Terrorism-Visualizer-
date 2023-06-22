const TerroDBConnection = require('./DBConnection');

async function checkOrganizations() {
    const query = 'SELECT name FROM organizations'; // Query to fetch the organization names
  
    try {
      const result = await TerroDBConnection.query(query);
      const organizations = result.map((row) => row.name);
  
      for (const organization of organizations) {
        const query = `SELECT DISTINCT attacks.*, weapons.weapon, attacktypes.attacktype, countries.country, targtypes.targtype FROM weapons JOIN attacks ON weapons.id = attacks.weapon_id JOIN attacktypes ON attacks.attacktype_id = attacktypes.id JOIN countries ON attacks.country_id = countries.id JOIN (SELECT DISTINCT ON (attack_id) attack_id, target_id FROM victims) AS distinct_victims ON distinct_victims.attack_id = attacks.id JOIN targtypes ON targtypes.id = distinct_victims.target_id WHERE organization LIKE $1`;
  
        try {
          const result = await TerroDBConnection.query(query, [organization]);
          if (result.length === 0) {
            console.log(organization);
          }
        } catch (error) {
          console.error('Error executing query:', error);
        }
      }
    } catch (error) {
      console.error('Error executing query:', error);
    }
  }
  
  checkOrganizations();