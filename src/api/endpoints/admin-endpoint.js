const {Endpoint} = require('./endpoint')
const TerrorDBConnection = require('../DBConnection');

class AdminEndpoint extends Endpoint {
    constructor(){super();};
    async get(req, res) {
        if (req.url.endsWith('users')) {
            let query = "SELECT * FROM users;";
            await TerrorDBConnection.query(query)
            .then((response) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            })
            .catch((error) => {
                console.log(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('An error occurred.');
            });
        }
        else if (req.url.endsWith('sessions')) {
            let query = "SELECT * FROM sessions;";
            await TerrorDBConnection.query(query)
            .then((response) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            })
            .catch((error) => {
                console.log(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('An error occurred.');
            });
        }
    }
    async post(req,res) {
        // POST
    }
}
module.exports = {AdminEndpoint};