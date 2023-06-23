
const {NotFoundEndpoint} = require('./endpoints/endpoint');
const {HomeEndpoint} = require('./endpoints/home-endpoint');
const {StaticEndpoint} = require('./endpoints/static-endpoint');
const {MapEndpoint} = require('./endpoints/map-endpoint');
const {NewsEndpoint} = require('./endpoints/news-endpoint');
const {AdminEndpoint} = require('./endpoints/admin-endpoint');
const {StatEndpoint} = require('./endpoints/statistic-endpoint');
const { LoginEndpoint } = require('./endpoints/login-endpoint');
const {LogoutEndpoint} = require('./endpoints/logout-endpoint');
const http = require('http');

const ENDPOINTS = {
  "\/app\/static/.*": new StaticEndpoint(),
  "\/static/.*": new StaticEndpoint(),
  "\/app\/.*": new HomeEndpoint(),
  "\/api/stat" : new StatEndpoint(),
  "\/login$": new LoginEndpoint(),
  "\/logout$": new LogoutEndpoint(),
  "\/api/news": new NewsEndpoint(),
  "\/api/map.*": new MapEndpoint(),
  "\/api/admin/.*": new AdminEndpoint(),

  "": new NotFoundEndpoint(),
}

const router = async (req, resp) => {
  console.log(`[INFO]: Request nou ${req.method}: ${req.url} `);
  let flag = false;
  for (const [path, endpoint] of Object.entries(ENDPOINTS)) {
    const regex = new RegExp(path);

    // Verificam daca calea acestui request se potriveste
    if (regex.test(req.url)) {
      console.log(`[INFO]: Am gasit calea ${req.url} si va fi rutat catre ${path}`);
      flag = true;
      await endpoint[req.method.toLowerCase()](req, resp);
      break;
    }
  }
  if (!(flag)){
    console.log(`[WARN]: Nu gasit endpoint pentru calea ${req.url}`);
  }
}

const main = async () => {
  const server = http.createServer(router);
  server.listen(3000);
}

main();

// const server = http.createServer((req, res) => {
//   /*  <<-- HOMEPAGE LOADING -->> */
//   if (req.url.match(/\/app\/.*/i) && ! req.url.includes("/static")) {
//       session(req, res);
//       // const section = req.url.match(/\/app\/.*/i);
//       const filePath = path.join(process.cwd(), '../view/index.html'); // ASTA NU RAMANE ASA. Ca sa evitam login-ul deocamdata.
//       fs.readFile(filePath, 'utf8', (err, content) => {
//         if (err) {
//           res.writeHead(500, { 'Content-Type': 'text/plain' });
//           res.end('Internal Server Error');
//           reject();
//         }

//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(content);
//       });
//   }
//   else if (req.url.startsWith('/api/map')) {
//       const urlObj = new URL(`http://${req.headers.host}${req.url}`);
//       const queryParams = urlObj.searchParams;
//       const organization = queryParams.get('Organization');
//       const from = new Date(queryParams.getAll('interval')[0]);
//       const until = new Date(queryParams.getAll('interval')[1]);
//       if (!isNaN(from) && !isNaN(until) && from > until){
//         console.log("date format error dumb");
//         res.writeHead(400, { 'Content-Type': 'text/plain' });
//         res.end('Invalid date range: "from" date is after "until" date.');
//       }      
//       let query = ' SELECT DISTINCT attacks.*, weapons.weapon, attacktypes.attacktype, countries.country, targtypes.targtype FROM weapons JOIN attacks ON weapons.id = attacks.weapon_id JOIN attacktypes ON attacks.attacktype_id = attacktypes.id JOIN countries ON attacks.country_id = countries.id JOIN (SELECT DISTINCT ON (attack_id) attack_id, target_id FROM victims) AS distinct_victims ON distinct_victims.attack_id = attacks.id JOIN targtypes ON targtypes.id = distinct_victims.target_id WHERE ';
//       const values = [];
//       let argCtr = 1;
//       if(!isNaN(from)){
//         query += ' date >= $'+argCtr;
//         argCtr++;
//         values.push(from);
//         if(!isNaN(until)){
//           query += ' and date <= $'+argCtr;
//           argCtr++;
//           values.push(until);
//         }
//       }
//       else if(!isNaN(until)){
//           query += ' date <= $'+argCtr;
//           argCtr++;
//           values.push(until);
//       }

//       if(organization)
//       {
//         if (!isNaN(until) || !isNaN(from)){
//           query += ' and organization like $'+argCtr;
//           argCtr++;
//         } else {
//           query += 'organization like $'+argCtr;
//           argCtr++;
//         }
//         values.push(organization);
//       }
//       console.log(query);
//       console.log(values);
//       if (values.length === 0 ){
//         res.writeHead(400, { 'Content-Type': 'text/plain' });
//         res.end('No data provided.');
//       }
//       TerrorDBConnection.query(query, values)
//       .then((rows) => {
//         if (rows.length > 0) {
//           console.log(rows);
//           res.writeHead(200, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify(rows));
//         } else {
//           res.writeHead(404, { 'Content-Type': 'text/plain' });
//           res.end('No rows found.');
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('An error occurred.');
//       });
//   }
//   /* <<-- NEWS -->> */
//   /* Alternativa: Bing news, 1000 requests/month . Acum e 100/zi si un request/secunda. 
//   Tranzitia la alt api e usoara, doar de schimbat get-ul si accesarea obiectului returnat. */
//   else if(req.url.startsWith("/api/news")) {
//     const fetchData = async () => {
//       const options = {
//         method: 'GET',
//         url: 'https://real-time-news-data.p.rapidapi.com/search',
//         params: {
//           query: 'Terrorism',
//           lang: 'en'
//         },
//         headers: {
//           'X-RapidAPI-Key': '586835d4c1msh01957fc912c357bp163e5djsne9dcb886b679',
//           'X-RapidAPI-Host': 'real-time-news-data.p.rapidapi.com'
//         }
//       };

//       try {
//         // console.log("Waiting for the API response...");
//         const response = await axios.request(options);
//         // console.log("Got the API response!");
//         return response.data;
//       } catch (error) {
//         console.error(error);
//         throw error;
//       }
//     };
//     fetchData()
//       .then(newsArr => {
//         const response = [];

//         const data = newsArr.data;
//         // 3 stiri random din cele returnate
//         response.push(data[getRandomInt(1, data.length / 6)]);
//         response.push(data[getRandomInt(data.length / 6 + 1, data.length / 3)]);
//         response.push(data[getRandomInt(data.length / 3 + 1, data.length)]);

//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify(response));
//       })
//       .catch(error => {
//         console.error("API request failed:", error);
//       });
//   }
//   /*  <<-- STATIC LOADING -->> */
//   else if(req.url.includes('static')) {
//       let filePath = path.join(process.cwd(), '../', req.url.replace("/app",''));
//       let mimeType = path.extname(filePath)
//       let contentType = '';
//       // load various file types

//       switch (mimeType) {
//           case '.png': contentType = 'image/png'; break;
//           case '.jpg': contentType = 'image/jpg'; break;
//           case '.jpeg': contentType = 'image/jpeg'; break;
//           case '.js': contentType = 'text/javascript'; break;
//           case '.ico' : contentType = 'image/x-icon'; break;
//           case '.css': contentType = 'text/css'; break;
//           default: contentType = 'text/plain';
//           break;
//       }
//       if (req.url.includes('terrorist.png')) {
//         filePath = path.join(process.cwd(), '../static/images/terrorist.png');
//         contentType = 'image/png';
//       }

//       fs.readFile(filePath, (err, content) => {
//         if (err) {
//           res.writeHead(500, { 'Content-Type': 'text/plain' });
//           res.end('Internal Server Error');
//         }

//         res.writeHead(200, { 'Content-Type': contentType });
//         res.end(content);
//     });
//    }
//    else if(req.url === '/login' && req.method === "POST") {
//       session(req, res);
//       const filePath = path.join(process.cwd(), '../view/index.html');
//       fs.readFile(filePath, 'utf8', (err, content) => {
//         if (err) {
//           res.writeHead(500, { 'Content-Type': 'text/plain' });
//           res.end('Internal Server Error');
//           reject();
//         }

//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(content);
//    });
//   }
//   else if (req.url.startsWith('/api/admin/')) {
//     // NEAPARAT: de verificat daca e admin !!!
//     if (req.url.endsWith('users')) {
//       switch(req.method) {
//         case 'GET':
//           let query = "SELECT * FROM users;";
//           TerrorDBConnection.query(query)
//           .then((response) => {
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(response));
//           })
//           .catch((error) => {
//             console.log(error);
//             res.writeHead(500, { 'Content-Type': 'text/plain' });
//             res.end('An error occurred.');
//           });
//           break;
//         case 'POST':
//           // handle post user event
//       }
//     }
//     else if (req.url.endsWith('sessions')) {
//       let query = "SELECT * FROM sessions;";
//           TerrorDBConnection.query(query)
//           .then((response) => {
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(response));
//           })
//           .catch((error) => {
//             console.log(error);
//             res.writeHead(500, { 'Content-Type': 'text/plain' });
//             res.end('An error occurred.');
//           });
//     }
//   }
//   else if (req.url === '/login.html') {
//       session(req, res);
//       const filePath = path.join(process.cwd(), '../view/login.html');
//       fs.readFile(filePath, 'utf8', (err, content) => {
//         if (err) {
//           res.writeHead(500, { 'Content-Type': 'text/plain' });
//           res.end('Internal Server Error');
//           reject();
//         }

//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(content);

//         resolve();
//       });
//   }
// });

// const port = 3000;
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
