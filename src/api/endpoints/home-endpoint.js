const fs = require('fs');
const path = require('path');
const { Endpoint } = require('./endpoint');
const TerrorDBConnection = require('../DBConnection');

let sessions = [];

class HomeEndpoint extends Endpoint {
  constructor(){super();};

  async handleSession(req) {
    let isLoggedIn = false;
    sessions = await TerrorDBConnection.query('SELECT * FROM sessions;')
    .then((rows) => {
      return rows;
    });
    console.log(sessions);

    const cookies = req.headers.cookie ? req.headers.cookie.split(";") : [];
    const sessionIdCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("sessionId=")
    );
    if (sessionIdCookie) {
      const sessionId = sessionIdCookie.split("=")[1].trim();
      
      // Check if the session ID exists and retrieve the session data
      const sessionData = sessions[sessionId];
      console.log("sessions isEmpty: ", sessions);
      if (sessionData) {
        isLoggedIn = true;
        console.log("ESTI LOGAT: ", isLoggedIn);
      } else {
        isLoggedIn = false;
        console.log("NU ESTI LOGAT: ", isLoggedIn);
      }
    } else {
      console.log("NU AM GASIT COOKIE: ", isLoggedIn);
    }
    return isLoggedIn;
    //---------------------------
  };

  async get(req, res) {
    let filePath = '';
    let flag = await this.handleSession(req);
    if (flag == false) {
      console.log("FALS");
       filePath = path.join(process.cwd(), '../view/login.html');
    }
    else {
      console.log("TRUE");
      filePath = path.join(process.cwd(), '../view/index.html');
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile(filePath, 'utf8', (err, content) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
              }
      
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(content);
            });
  }
};
module.exports = {HomeEndpoint};