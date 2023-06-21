
let session = require('./sessionManager');
const http = require('http');
const fs = require('fs');
const path = require('path');
const TerrorDBConnection = require('./DBConnection.js');

const server = http.createServer((req, res) => {
  
  /*  <<-- HOMEPAGE LOADING -->> */
  if (req.url === '/') {
    const loadLogin = new Promise((resolve, reject) => {
      session(req, res);
      const filePath = path.join(process.cwd(), '../view/index.html'); // ASTA NU RAMANE ASA. Ca sa evitam login-ul deocamdata.
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          reject();
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);

        resolve();
      });
    });
  }
  else if (req.url.startsWith('/api/map')) {
      console.log(req.url);
      const urlObj = new URL(`http://${req.headers.host}${req.url}`);
      const queryParams = urlObj.searchParams;
      const organization = queryParams.get('Organization');
      const from = new Date(queryParams.getAll('interval')[0]);
      const until = new Date(queryParams.getAll('interval')[1]);
      if (!isNaN(from) && !isNaN(until) && from > until){
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
        if(!isNaN(until)){
          query += ' and date <= $'+argCtr;
          argCtr++;
          values.push(until);
        }
      }
      else if(!isNaN(until)){
          query += ' date <= $'+argCtr;
          argCtr++;
          values.push(until);
      }

      if(organization)
      {
        if (!isNaN(until) || !isNaN(from)){
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
      if (values.length === 0 ){
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('No data provided.');
      }
      TerrorDBConnection.query(query, values)
      .then((rows) => {
        if (rows.length > 0) {
          console.log(rows);
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
  /*  <<-- STATIC LOADING -->> */
  else if(req.url.includes('static')) {
    const loadStatic = new Promise((resolve, reject) => {
      let filePath = path.join(process.cwd(), '../', req.url);
      let mimeType = path.extname(filePath)
      let contentType = '';
      // load various file types

      switch (mimeType) {
          case '.png': contentType = 'image/png'; break;
          case '.jpg': contentType = 'image/jpg'; break;
          case '.jpeg': contentType = 'image/jpeg'; break;
          case '.js': contentType = 'text/javascript'; break;
          case '.ico' : contentType = 'image/x-icon'; break;
          case '.css': contentType = 'text/css'; break;
          default: contentType = 'text/plain';
          break;
      }
      if (req.url.includes('terrorist.png')) {
        filePath = path.join(process.cwd(), '../static/images/terrorist.png');
        contentType = 'image/png';
      }

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          reject();
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);

        resolve();
    });
    })
   }
   else if(req.url === '/login' && req.method === "POST") {
    const loadHome = new Promise((resolve, reject) => {
      session(req, res);
      const filePath = path.join(process.cwd(), '../view/index.html');
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          reject();
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);

        resolve();
      });

   });
  }
  else if (req.url === '/login.html') {
    const loadLogin = new Promise((resolve, reject) => {
      session(req, res);
      const filePath = path.join(process.cwd(), '../view/login.html');
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          reject();
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);

        resolve();
      });
    });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
