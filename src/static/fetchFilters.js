function drawPieChart(items) {
  // Load the Visualization API and the corechart package
  google.charts.load("current", { packages: ["corechart"] });

  // Set a callback function to run when the Google Charts library is loaded
  google.charts.setOnLoadCallback(() => createPieChart(items));
}
var dataTable = null;
var imageURI = null;
function createPieChart(items) {
  dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Attack Type");
  dataTable.addColumn("number", "Count");

  let deadlyCount = 0;
  let notDeadlyCount = 0;

  items.forEach((item) => {
    if (item.killed > 0) {
      deadlyCount++;
    } else {
      notDeadlyCount++;
    }
  });

  dataTable.addRow(["Deadly Attacks", deadlyCount]);
  dataTable.addRow(["Failed Attacks", notDeadlyCount]);

  var options = {
    title: "Attack Types",
    width: 650,
    height: 650,
    is3D: true,
    slices: {
      0: { color: "red" },
      1: { color: "black" },
    },
    backgroundColor: "transparent",
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("anyChart")
  );
  chart.draw(dataTable, options);

  imageURI = chart.getImageURI();
}

function drawLineChart(items) {
  // Load the Visualization API and the corechart package
  google.charts.load("current", { packages: ["corechart"] });

  // Set a callback function to run when the Google Charts library is loaded
  google.charts.setOnLoadCallback(() => createLineChart(items));
}

function createLineChart(items) {
  // Process the data and create a DataTable
  dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Year");
  dataTable.addColumn("number", "Property Damages in USD");

  // Count the number of attacks per year
  const damagesByYear = {};

  items.forEach((item) => {
    const year = new Date(item.date).getFullYear().toString();
    damagesByYear[year] = damagesByYear[year]
      ? damagesByYear[year] + item.property_value
      : item.property_value;
  });

  // Add the data to the DataTable
  for (var key in damagesByYear) {
    dataTable.addRow([key, damagesByYear[key]]);
  }

  // Set chart options
  const options = {
    title:
      "Property Damages Per Year",
    width: 800,
    height: 800,
    colors: ["black"],
    backgroundColor: "transparent",
  };

  // Create and draw the chart
  const chart = new google.visualization.LineChart(
    document.getElementById("anyChart")
  );
  chart.draw(dataTable, options);
  imageURI = chart.getImageURI();
}

function drawScatterChart(items) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(() => createScatterChart(items));
}

function createScatterChart(items) {
  // Process the data and create a DataTable
  dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", "Year");
  dataTable.addColumn("number", "Number of Deaths");

  // Count the number of attacks per year
  const attacksByYear = {};

  items.forEach((item) => {
    const year = new Date(item.date).getFullYear().toString();
    attacksByYear[year] = attacksByYear[year] ? attacksByYear[year] + 1 : 1;
  });

  // Add the data to the DataTable
  for (var key in attacksByYear) {
    dataTable.addRow([key, attacksByYear[key]]);
  }

  // Set chart options
  const options = {
    title:
      "Number of Attacks Per Year, organization: " +
      document.getElementById("Organization").value,
    width: 800,
    height: 800,
    colors: ["black"],
    backgroundColor: "transparent",
  };

  // Create and draw the chart
  const chart = new google.visualization.ScatterChart(
    document.getElementById("anyChart")
  );
  chart.draw(dataTable, options);
  imageURI = chart.getImageURI();
}

document.getElementById("formId").addEventListener("submit", function (event) {
  event.preventDefault();

  const form = event.target;
  const url = form.getAttribute("action");
  const queryParams = new URLSearchParams(new FormData(form)).toString();
  const fullUrl = url + "?" + queryParams;

  console.log(fullUrl);
  fetch(fullUrl)
    .then((response) => {
      console.log("Form submission successful");
      history.pushState(null, null, fullUrl);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((jsonList) => {
      console.log("JSON: ", jsonList);
      const chartValue = document.getElementById("chart").value;
      if (chartValue == 1) {
        drawPieChart(jsonList);
      } else if (chartValue == 2) {
        drawLineChart(jsonList);
      } else if (chartValue == 3) {
        drawScatterChart(jsonList);
      }
    })
    .catch((error) => {
      console.error("Error submitting form:", error);
    });
});

fetch("/api/stat")
  .then((response) => response.text())
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const regionSelect = document.getElementById("region");
    const targetSelect = document.getElementById("main-target");
    const attackType = document.getElementById("attack-type");
    const nationality = document.getElementById("main-nationality");
    const mainWeapon = document.getElementById("main-weapon");

    regionSelect.innerHTML = "";
    targetSelect.innerHTML = "";
    attackType.innerHTML = "";
    nationality.innerHTML = "";
    mainWeapon.innerHTML = "";

    const regionOptions = doc.querySelectorAll("#region option");
    regionOptions.forEach((option) => {
      regionSelect.appendChild(option.cloneNode(true));
    });

    const targetOptions = doc.querySelectorAll("#main-target option");
    targetOptions.forEach((option) => {
      targetSelect.appendChild(option.cloneNode(true));
    });

    const attackOptions = doc.querySelectorAll("#attack-type option");
    attackOptions.forEach((option) => {
      attackType.appendChild(option.cloneNode(true));
    });

    const nationalityOptions = doc.querySelectorAll("#main-nationality option");
    nationalityOptions.forEach((option) => {
      nationality.appendChild(option.cloneNode(true));
    });

    const weaponOptions = doc.querySelectorAll("#main-weapon option");
    weaponOptions.forEach((option) => {
      mainWeapon.appendChild(option.cloneNode(true));
    });

  })
  .catch((error) => {
    console.error("Failed to fetch options:", error);
  });