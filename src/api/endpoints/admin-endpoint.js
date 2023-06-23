const {Endpoint} = require('./endpoint')
const TerrorDBConnection = require('../DBConnection');
const sessionsManager = require('../sessionManager');

class AdminEndpoint extends Endpoint {
    constructor(){super();};

    async get(req, res) {
        let flag = [];
        flag = await sessionsManager(req);
        // flag[0] -> login status, flag[1] -> admin status
        if (flag[0] == false || flag[1] == false) {
            console.log("Not admin!");
            res.setHeader("Location", "/app/home");
            res.statusCode = 302;
            res.end();
        }
        else {
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
    }
    async post(req,res) {
        // POST
    }
}
module.exports = {AdminEndpoint};