function drawChart(items) {
    // Load the Visualization API and the corechart package
    google.charts.load('current', { 'packages': ['corechart'] });
  
    // Set a callback function to run when the Google Charts library is loaded
    google.charts.setOnLoadCallback(() => createChart(items));
}
  
  function createChart(items) {
    // Process the data and create a DataTable
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Year');
    dataTable.addColumn('number', 'Number of Attacks');
  
    // Count the number of attacks per year
    const attacksByYear = {};
  
    items.forEach(item => {
      const year = new Date(item.date).getFullYear().toString();
      attacksByYear[year] = attacksByYear[year] ? attacksByYear[year] + 1 : 1;
    });
  
    // Add the data to the DataTable
    for (var key in attacksByYear){
      dataTable.addRow([key, attacksByYear[key]]);
    }
  
    // Set chart options
    const options = {
      title: 'Number of Attacks Per Year, organization: '+document.getElementById('Organization').value,
      width: 1000,
      height: 800,
      colors: ['black'],
      backgroundColor: 'transparent'
    };
  
    // Create and draw the chart
    const chart = new google.visualization.ColumnChart(document.getElementById('map-chart'));
    chart.draw(dataTable, options);
  }