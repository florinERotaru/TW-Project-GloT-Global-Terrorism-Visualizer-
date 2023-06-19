//const fs = require("fs");
//var isLoggedIn = require("../../api/server");
//var sessions = require("../../api/server.js");
//import { isLoggedIn } from "../../api/server.js";

var isLoggedIn;

// Establish WebSocket connection
const socket = new WebSocket("ws://localhost:3001");

// Listen for messages from the server
socket.addEventListener("message", function (event) {
  // Check the received message and perform actions accordingly
  if (event.data === "generate") {
    // Call the generateSomething() function
    isLoggedIn = true;
    //socket.close();
  }
});

socket.onclose = function () {
  console.log("Connection closed");
  socket.close();
};

/* ===================================== PIE CHART ========================================= */
document
  .getElementById("generate-chart")
  .addEventListener("click", function () {
    if (isLoggedIn === true) {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(function () {
        var data = new google.visualization.DataTable();
        data.addColumn("string", "Element");
        data.addColumn("number", "Percentage");
        data.addRows([
          ["Nitrogen", Math.random()],
          ["Oxygen", Math.random()],
          ["Hydrogen", Math.random()],
          ["Other", Math.random()],
        ]);

        var options = {
          title: "Random Pie Chart",
          pieHole: 0.4,
          pieSliceTextStyle: {
            color: "white",
          },
          slices: {
            0: { color: "#2ecc71" },
            1: { color: "#3498db" },
            2: { color: "#95a5a6" },
            3: { color: "#ac0eeb" },
          },
        };

        var chart = new google.visualization.PieChart(
          document.getElementById("myPieChart")
        );
        chart.draw(data, options);
      });
    }
  });

/* ===================================== BAR CHART ============================================== */

document
  .getElementById("generate-chart")
  .addEventListener("click", function () {
    if (isLoggedIn === true) {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(function () {
        var data = new google.visualization.DataTable();
        data.addColumn("string", "Element");
        data.addColumn("number", "Percentage");
        data.addRows([
          ["Nitrogen", Math.random()],
          ["Oxygen", Math.random()],
          ["Hydrogen", Math.random()],
          ["Other", Math.random()],
        ]);

        var options = {
          title: "Random Bar Chart",
          legend: { position: "none" },
          vAxis: {
            title: "Element",
            textStyle: {
              fontSize: 16,
            },
          },
          hAxis: {
            title: "Percentage",
            textStyle: {
              fontSize: 16,
            },
          },
          bars: "horizontal",
        };

        var chart = new google.visualization.BarChart(
          document.getElementById("myBarChart")
        );
        chart.draw(data, options);
      });
    }
  });
