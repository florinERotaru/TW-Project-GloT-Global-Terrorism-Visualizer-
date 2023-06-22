// import { promises as fsAsync } from "fs";
// import { join, extname } from 'path';

// import { Endpoint } from './endpoint.js'

const {Endpoint} = require('./endpoint.js');
const fs = require('fs');
const path = require('path');

class StaticEndpoint extends Endpoint {
  constructor(){super()}
  async get(req, res) {
          let filePath = path.join(process.cwd(), '../', req.url.replace("/app",''));
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
            }
    
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    
  }
}
module.exports = {StaticEndpoint};
