const { Endpoint } = require('./endpoint');
const TerrorDBConnection = require('../DBConnection');

const querystring = require("querystring");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const path = require('path');

class LoginEndpoint extends Endpoint {
    async get(_, res) {
        console.log("login GET");
        const filePath = path.join(process.cwd(), '../view/login.html');
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
    async post(req, res) {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            let formData = querystring.parse(body);
            let formType = formData.formType;
            console.log("FormType: ", formData);
            
            if (formType === "signup") {
                console.log("Sign up!");

                const username = formData.txt;
                const email = formData.email;
                const password = formData.pswd;
                if (email === 'admin@GloTv.glot') {
                    res.setHeader("Location", "/login");
                    res.statusCode = 302;
                    res.end();
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    try {
                    await TerrorDBConnection.query(
                        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
                        [username, email, hashedPassword, 1]
                    );
                    } 
                    catch (error) {
                        console.error("Error inserting a new user");
                    }
                    res.setHeader("Location", "/login");
                    res.statusCode = 302;
                    res.end();
                }

            } else if (formType === "signin") {
                console.log("Sign in!");
                const email = formData.email;
                const password = formData.pswd;
                try {
                await TerrorDBConnection.query(
                    "SELECT password FROM users WHERE email = $1",
                    [email])
                    .then(async (rows) => {
                        if (rows.length === 0) {
                            res.setHeader("Location", "/login");
                            res.statusCode = 302;
                            res.end();
                        } else {
                            const hashedPassword = rows[0].password;
                            const passwordMatch = bcrypt.compare(
                            password,
                            hashedPassword
                            );
                            if (passwordMatch) {
                                res.statusCode = 200;
                                const sessionId = uuidv4();
        
                                res.setHeader("Set-Cookie", `sessionId=${sessionId}; HttpOnly`);
                                res.setHeader('Location', '/app/home');
                                res.statusCode = 302;
                                res.end();
                                try {
                                    await TerrorDBConnection.query(
                                    "INSERT INTO sessions (cookieId, email) VALUES ($1, $2)",
                                    [sessionId, email]
                                    );
                                    console.log("Inserted session");
                                } catch (error) {
                                    console.error("Error inserting a new session");
                                }
                            } else {
                                    res.setHeader("Location", "/login");
                                    res.statusCode = 302;
                                    res.end();
                                }
                        }
                    });
                } catch (error) {
                    console.error("Error logging user: ", error);
                    res.statusCode = 500;
                    res.write("Error logging user");
                    res.end();
                }
            }
        });
    }
}

module.exports = {LoginEndpoint};