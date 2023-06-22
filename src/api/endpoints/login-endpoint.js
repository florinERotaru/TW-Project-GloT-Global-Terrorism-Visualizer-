const { Endpoint } = require('./endpoint');
const TerrorDBConnection = require('../DBConnection');

const querystring = require("querystring");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class LoginEndpoint extends Endpoint {
    async post(req, res) {
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
                console.log("Sign up!");

                // Access the submitted values
                const username = formData.username;
                const email = formData.email;
                const password = formData.password;
                const hashedPassword = bcrypt.hash(password, 10);
                // Perform signup logic here
                try {
                await TerrorDBConnection.query(
                    "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 0)",
                    [username, email, hashedPassword]
                );
                res.end("Inserted user");
                } 
                catch (error) {
                    console.error("Error inserting a new user");
                }
                // Send a response back to the client
                res.setHeader("Location", "/login");
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Sign-up successful");

            } else if (formType === "signin") {
                console.log("sign in!!!");
                // Parse the form data
                // Access the submitted values
                const email = formData.email;
                const password = formData.password;

                //Search in the db
                try {
                const result = await TerrorDBConnection.query(
                    "SELECT password FROM users WHERE email = $1",
                    [formData.email]
                );
                if (result.rows.length === 0) {
                    res.statusCode = 404;
                    //res.setHeader("Content-Type", "text/plain");
                    res.write("Email/Password incorrect!");
                } else {
                    const hashedPassword = result.rows[0].password;
                    const passwordMatch = bcrypt.compare(
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
                        res.setHeader("Location", "/app/home");
                        //res.writeHead(200, { "Content-Type": "text/plain" });
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
}

module.exports = {LoginEndpoint};