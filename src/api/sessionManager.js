// const { v4: uuidv4 } = require("uuid");
// const url = require("url");
// const path = require("path");
// const querystring = require("querystring");
// const fs = require("fs");

// // Store the session data
// let isLoggedIn = false;

// const handleSession = (req, res) => {
//   // Your existing session handling logic here
//   //const parsedUrl = url.parse(req.url);
//   // console.log(req);
//   //const pathWithoutHash = parsedUrl.pathname;
//   // ------------------------------ Extract session ID from cookies ----------------------------------
//   const cookies = req.headers.cookie ? req.headers.cookie.split(";") : [];
//   const sessionIdCookie = cookies.find((cookie) =>
//     cookie.trim().startsWith("sessionId=")
//   );
//   if (sessionIdCookie) {
//     const sessionId = sessionIdCookie.split("=")[1].trim();

//     // Check if the session ID exists and retrieve the session data
//     const sessionData = sessions[sessionId];
//     console.log("sessions isEmpty: ", sessions);
//     if (sessionData) {
//       // The user is logged in
//       isLoggedIn = true;
//       console.log("ESTI LOGAT: ", isLoggedIn);
//     } else {
//       isLoggedIn = false;
//       console.log("NU ESTI LOGAT: ", isLoggedIn);
//     }
//   } else {
//     //isLoggedIn = false;
//     console.log("NU AM GASIT COOKIE: ", isLoggedIn);
//   }
//   return isLoggedIn;
//   //---------------------------
// };

// module.exports = handleSession;
