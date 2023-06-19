const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const querystring = require("querystring");
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const WebSocket = require("ws");

const { v4: uuidv4 } = require("uuid");

const client = new Client({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "admin",
  database: "mock",
});

// Connect
client.connect();

// Create the table
const createUsersTable = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
      );
    `);
    console.log("Users table created");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

//Import modules
const handleSession = require("./sessionManager");
const { authenticationLogic } = require("./authentication");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathWithoutHash = parsedUrl.pathname;

  if (pathWithoutHash === "/") {
    //----------------------------- Extract session ID from cookies ----------------------------------------------------
    handleSession(req, res);
    //------------------------------------------------------------------------------------------------------------------

    /*  <<-- HOMEPAGE LOADING -->> */
    const loadHome = new Promise((resolve, reject) => {
      const filePath = path.join(process.cwd(), "../view/index.html");
      fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          reject();
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);

        resolve();
      });
    });
    //------------------------------------------- Signin Logic --------------------------------------------
  } else if (pathWithoutHash === "/login") {
    //--------------------------------------------------------------------------------------------

    authenticationLogic(req, res);
    //------------------------------------------------------------------------------------------------------------
  } else if (req.url.includes("static")) {
    /*  <<--------------- STATIC LOADING ----------------->> */
    const loadStatic = new Promise((resolve, reject) => {
      const filePath = path.join(process.cwd(), "../", req.url);
      let mimeType = path.extname(filePath);
      let contentType = "";
      // load various file types

      switch (mimeType) {
        case ".png":
          contentType = "image/png";
          break;
        case ".jpg":
          contentType = "image/jpg";
          break;
        case ".jpeg":
          contentType = "image/jpeg";
          break;
        case ".js":
          contentType = "text/javascript";
          break;
      }
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          reject();
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);

        resolve();
      });
    });
  }
});

const port = 3000;
server.listen(port, () => {
  //createUsersTable();
  console.log(`Server is running on port ${port}`);
});
