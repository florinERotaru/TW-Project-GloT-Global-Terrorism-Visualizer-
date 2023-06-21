const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const querystring = require("querystring");
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
// Store the session data
let sessions = {};
//const isLoggedIn = false;

const client = new Client({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "admin",
  database: "mock",
});

// Connect
client.connect();

const authenticationLogic = (req, res) => {
  //const parsedUrl = url.parse(req.url);
  //const pathWithoutHash = parsedUrl.pathname;
  console.log("Suntem in url-ul de login!");
  if (req.method === "GET") {
    console.log("Am dat GET in login");
    const loadLogin = new Promise((resolve, reject) => {
      const filePath = path.join(process.cwd(), "../view/login.html");
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
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      console.log("Am dat POST in login");
      let formData = querystring.parse(body);
      let formType = formData.formType;
      console.log("FormType: ", formData);
      if (formType === "signup") {
        console.log("sign up!!!");
        // Parse the form data
        //let formData = querystring.parse(body);
        //let formType = formData.formType;
        // Access the submitted values
        const username = formData.username;
        const email = formData.email;
        const password = formData.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        // Perform signup logic here
        try {
          await client.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [username, email, hashedPassword]
          );
          //res.end("Inserted user");
        } catch (error) {
          console.error("Error inserting a new user");
        }

        //Generate unique uuid session
        const sessionId = uuidv4();
        //Store session ID in a cookie on the client side
        res.setHeader("Set-Cookie", `sessionId=${sessionId}; HttpOnly`);

        //Store session data on server side
        sessions[sessionId] = {
          //username: username,
          email: email,
          password: password,
        };

        // Send a response back to the client
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Signup successful");
      } else if (formType === "signin") {
        console.log("sign in!!!");
        // Parse the form data
        //let formData = querystring.parse(body);

        // Access the submitted values
        const email = formData.email;
        const password = formData.password;

        //Search in the db
        try {
          const result = await client.query(
            "SELECT password FROM users WHERE email = $1",
            [formData.email]
          );
          if (result.rows.length === 0) {
            res.statusCode = 404;
            //res.setHeader("Content-Type", "text/plain");
            res.write("Email/Password incorrect!");
          } else {
            const hashedPassword = result.rows[0].password;
            const passwordMatch = await bcrypt.compare(
              formData.password,
              hashedPassword
            );
            //res.setHeader("Content-Type", "text/plain");
            if (passwordMatch) {
              res.statusCode = 200;

              //Generate unique uuid session
              const sessionId = uuidv4();
              //Store session ID in a cookie on the client side
              res.setHeader("Set-Cookie", `sessionId=${sessionId}; HttpOnly`);
              //Login successful --> redirect catre home
              res.setHeader("Location", "/");

              //res.writeHead(200, { "Content-Type": "text/plain" });
              res.end();

              //Store session data on server side
              sessions[sessionId] = {
                //username: username,
                email: email,
                password: password,
              };
            } else {
              //res.setHeader("Content-Type", "text/plain");
              res.statusCode = 404;
              res.write("Email/Password incorrect!");
            }
          }
        } catch (error) {
          console.error("Error logging user: ", error);
          res.statusCode = 500;
          res.write("Error logging user");
        }
        res.end();
      }
    });
  }
};
module.exports = { sessions, authenticationLogic };
//module.exports = authenticationLogic;
