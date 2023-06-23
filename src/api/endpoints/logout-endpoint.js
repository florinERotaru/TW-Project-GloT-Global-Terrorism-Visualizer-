const { Endpoint } = require('./endpoint');
const TerrorDBConnection = require('../DBConnection');
const fs = require('fs');
const path = require('path');

class LogoutEndpoint extends Endpoint {
    async get(req, res) {
        try {
            const cookies = req.headers.cookie ? req.headers.cookie.split(";") : [];
            const sessionIdCookie = cookies.find((cookie) =>
                cookie.trim().startsWith("sessionId=")
            );
            if (sessionIdCookie) {
                const sessionId = sessionIdCookie.split("=")[1].trim();
                await TerrorDBConnection.query('DELETE FROM sessions WHERE cookieid=$1',[sessionId]);
                console.log("Session deleted!");
            }
            console.log("Logged out");
            res.setHeader("Location", "/login");
            res.statusCode = 302;
            res.end();
        }
        catch (error) {
            console.error(error);
        }
    }
}

module.exports = {LogoutEndpoint};
