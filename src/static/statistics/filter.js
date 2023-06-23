// /* ===================================== PIE CHART ========================================= */


// document.getElementById('generate-chart').addEventListener('click', function() {
//   google.charts.load('current', {packages: ['corechart']});
//   google.charts.setOnLoadCallback(function() {
//     dataPie = new google.visualization.DataTable();
//     dataPie.addColumn('string', 'Element');
//     dataPie.addColumn('number', 'Percentage');
//     dataPie.addRows([
//       ['Nitrogen', Math.random()],
//       ['Oxygen', Math.random()],
//       ['Hydrogen', Math.random()],
//       ['Other', Math.random()]
//     ]);

//     var options = {
//       title: 'Random Pie Chart',
//       pieHole: 0.4,
//       pieSliceTextStyle: {
//         color: 'white',
//       },
//       slices: {
//         0: { color: '#2ecc71' },
//         1: { color: '#3498db' },
//         2: { color: '#95a5a6' },
//         3: { color: '#ac0eeb'}
//       }
//     };

//     var pieChart = new google.visualization.PieChart(document.getElementById('myPieChart'));
//     pieChart.draw(dataPie, options);

//     imageURI = pieChart.getImageURI();
//   });
// });

// /* ===================================== BAR CHART ============================================== */

// document.getElementById('generate-chart').addEventListener('click', function() {
//   google.charts.load('current', {packages: ['corechart']});
//   google.charts.setOnLoadCallback(function() {
//     var data = new google.visualization.DataTable();
//     data.addColumn('string', 'Element');
//     data.addColumn('number', 'Percentage');
//     data.addRows([
//       ['Nitrogen', Math.random()],
//       ['Oxygen', Math.random()],
//       ['Hydrogen', Math.random()],
//       ['Other', Math.random()]
//     ]);

//     var options = {
//       title: 'Random Bar Chart',
//       legend: { position: 'none' },
//       vAxis: {
//         title: 'Element',
//         textStyle: {
//           fontSize: 16
//         }
//       },
//       hAxis: {
//         title: 'Percentage',
//         textStyle: {
//           fontSize: 16
//         }
//       },
//       bars: 'horizontal'
//     };

//     var chart = new google.visualization.BarChart(document.getElementById('myBarChart'));
//     chart.draw(data, options);
//   });
// });