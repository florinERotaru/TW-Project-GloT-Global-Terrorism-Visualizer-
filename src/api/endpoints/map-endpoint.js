const {Endpoint} = require('./endpoint.js');
const TerrorDBConnection = require('../DBConnection.js');
const sessionsManager = require('../sessionManager');

class MapEndpoint extends Endpoint {
    constructor(){super();};

    async get(req, res) {
        let flag = await sessionsManager(req);
        if (flag == false) {
            console.log("FALS");
            res.setHeader("Location", "/login");
            res.statusCode = 302;
            res.end();
        } else {
            if (req.url.includes('/attack/')) {
                let values = [];
                console.log("Am intrat in attack.");
                const id = req.url.split('/')[4];
                console.log(req.url);
                console.log(id);
                let query = 'SELECT attacks.*, victims.corp, victims.victim, targsubtypes.targsubtype FROM attacks JOIN victims ON attacks.id = victims.attack_id JOIN targsubtypes ON victims.target_subtype_id = targsubtypes.id WHERE attacks.id = $1'
                values = [id];
                await TerrorDBConnection.query(query, values)
                .then((rows) => { // may be no rows <=> no victims
                    // console.log(rows);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(rows));
                })
                .catch((error) => {
                console.log(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('An error occurred.');
                });
            }
            else if(req.url.includes('/organizations')) {
                await TerrorDBConnection.query('SELECT name FROM organizations WHERE EXISTS (SELECT 1 FROM attacks JOIN weapons ON weapons.id = attacks.weapon_id JOIN attacktypes ON attacks.attacktype_id = attacktypes.id JOIN countries ON attacks.country_id = countries.id JOIN (SELECT DISTINCT ON (attack_id) attack_id, target_id FROM victims) AS distinct_victims ON distinct_victims.attack_id = attacks.id JOIN targtypes ON targtypes.id = distinct_victims.target_id WHERE organizations.name = attacks.organization)')
                .then((rows) =>{
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(rows));
                })
                .catch((error) => {
                    console.log(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('An error occurred.');
                });
            }
            else {
                const urlObj = new URL(`http://${req.headers.host}${req.url}`);
                const queryParams = urlObj.searchParams;
                const organization = queryParams.get('Organization');
                const from = new Date(queryParams.getAll('interval')[0]);
                const until = new Date(queryParams.getAll('interval')[1]);
                if (!isNaN(from) && !isNaN(until) && from > until) {
                    console.log("date format error dumb");
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Invalid date range: "from" date is after "until" date.');
                }      
                let query = ' SELECT DISTINCT attacks.*, weapons.weapon, attacktypes.attacktype, countries.country, targtypes.targtype FROM weapons JOIN attacks ON weapons.id = attacks.weapon_id JOIN attacktypes ON attacks.attacktype_id = attacktypes.id JOIN countries ON attacks.country_id = countries.id JOIN (SELECT DISTINCT ON (attack_id) attack_id, target_id FROM victims) AS distinct_victims ON distinct_victims.attack_id = attacks.id JOIN targtypes ON targtypes.id = distinct_victims.target_id WHERE ';
                const values = [];
                let argCtr = 1;
                if(!isNaN(from)){
                query += ' date >= $'+argCtr;
                argCtr++;
                values.push(from);
                if(!isNaN(until)) {
                    query += ' and date <= $'+argCtr;
                    argCtr++;
                    values.push(until);
                }
                }
                else if(!isNaN(until)) {
                    query += ' date <= $'+argCtr;
                    argCtr++;
                    values.push(until);
                }

                if(organization && organization != 'Any') {
                    if (!isNaN(until) || !isNaN(from)) {
                        query += ' and organization like $'+argCtr;
                        argCtr++;
                    } else {
                        query += 'organization like $'+argCtr;
                        argCtr++;
                    }
                    values.push(organization);
                }
                console.log(query);
                console.log(values);
                if (values.length === 0 ) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('No data provided.');
                }
                await TerrorDBConnection.query(query, values)
                .then((rows) => {
                if (rows.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(rows));
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('No rows found.');
                }
                })
                .catch((error) => {
                    console.log(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('An error occurred.');
                });
            }
        }
}
}
module.exports = {MapEndpoint};