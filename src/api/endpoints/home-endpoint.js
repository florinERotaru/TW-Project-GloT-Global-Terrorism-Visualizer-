const fs = require('fs');
const path = require('path');
const { Endpoint } = require('./endpoint');
const sessionsManager = require('../sessionManager');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class HomeEndpoint extends Endpoint {
  constructor(){super();};
  
  async get(req, res) {
    let flag = [];
    flag = await sessionsManager(req);
    // flag[0] -> login status, flag[1] -> admin status
    if (flag[0] == false) {
      console.log("FALS");
      res.setHeader("Location", "/login");
      res.statusCode = 302;
      res.end();
    }
    else {
      console.log("TRUE");
      const filePath = path.join(process.cwd(), '../view/index.html');
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.readFile(filePath, 'utf8', (err, content) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
              }
              if (flag[1] == true) {

                const dom = new JSDOM(content);
                // append administration section
                const targetSection = dom.window.document.getElementById('main-nav-bar');
                let ulElement = targetSection.querySelector('ul');
                
                let ulCompleted = `<li><button onclick="openAdminTab()">Administration</button></li><script src="../static/admin.js"></script>`;
                ulCompleted += ulElement.innerHTML;

                ulElement.innerHTML = ulCompleted;
                content = '';
                content += "<!DOCTYPE html>"; content += dom.window.document.getElementsByTagName('html')[0].outerHTML;
              }
              
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(content);
            });
      }
  }
};
module.exports = {HomeEndpoint};