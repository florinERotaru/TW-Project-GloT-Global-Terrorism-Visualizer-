const TerrorDBConnection = require('./DBConnection');

async function handleSession(req) {
    let sessions = [];
    let isLoggedIn = false;
    let isAdmin = false;
    sessions = await TerrorDBConnection.query('SELECT * FROM sessions;')
    .then((rows) => {
      return rows;
    });
    const cookies = req.headers.cookie ? req.headers.cookie.split(";") : [];
    const sessionIdCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("sessionId=")
    );
    if (sessionIdCookie) {
        const sessionId = sessionIdCookie.split("=")[1].trim();
        sessions.forEach((element) => {
            //<---------------COMPARE COOKIES--------------->;
            if (element.cookieid === sessionId) {
                isLoggedIn = true;
            }
            if (element.email === "admin@GloTv.glot") {
                isAdmin = true;
            }
        });
    } 
    console.log("User logged in: ", isLoggedIn);
    return [isLoggedIn, isAdmin];
    //---------------------------
  };

  module.exports = handleSession;