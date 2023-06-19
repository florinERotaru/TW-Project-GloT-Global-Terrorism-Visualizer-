function downloadChartAsSvg() { 
    // asta e pentru pie-chartul ala mock, dar cand o sa fie un singur chart se va schimba doar valoarea asta
    const chartDiv = document.getElementById('myPieChart');

    var chartSVG = chartDiv.getElementsByTagName('svg')[0].outerHTML;
    chartSVG = chartSVG.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" ');

    const svgBlob = new Blob([chartSVG], { type: 'image/svg+xml' });
 
    const svgURL = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.href = svgURL;
    link.download = 'chart.svg';
    link.click();
}

function downloadChartAsPng() {
    const link = document.createElement('a');
    link.href = imageURI;
    link.download = 'piechart.png';
    link.click();
    URL.revokeObjectURL(link);
}

function downloadChartAsCsv() {
    var csvColumns;
    var csvContent;

    var downloadLink;
    const fileName = 'data.csv';
    // build column headings
    csvColumns = '';
    for (var i = 0; i < dataPie.getNumberOfColumns(); i++) {
      csvColumns += dataPie.getColumnLabel(i);
      if (i < (dataPie.getNumberOfColumns() - 1)) {
        csvColumns += ',';
      }
    }
    csvColumns += '\n';

    // build data rows
    csvContent = csvColumns + google.visualization.dataTableToCsv(dataPie);

    // export data
    downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    downloadLink.download = fileName;
    downloadLink.click();

    URL.revokeObjectURL(downloadLink);
}
    
function downloadMapAsPng() {
    // asta dureaza mai mult, ar trebui un loading animation sau ceva. also asynchronous cumva.
    leafletImage(map, function (err, canvas) {
        const dataURL = canvas.toDataURL();

        var link = document.createElement('a');

        link.href = dataURL;
        link.download = 'map.png';
        link.click();
        URL.revokeObjectURL(link);
    });
}