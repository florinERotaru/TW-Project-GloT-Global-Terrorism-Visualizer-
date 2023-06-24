function downloadChartAsSvg() { 
    const chartDiv = document.getElementById('anyChart');

    let chartSVG = chartDiv.getElementsByTagName('svg')[0].outerHTML;
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
    link.download = 'anyChart.png';
    link.click();
    URL.revokeObjectURL(link);
}

function downloadChartAsCsv() {
    let csvColumns;
    var csvContent;

    let downloadLink;
    const fileName = 'data.csv';
    // build column headings
    csvColumns = '';
    for (var i = 0; i < dataTable.getNumberOfColumns(); i++) {
      csvColumns += dataTable.getColumnLabel(i);
      if (i < (dataTable.getNumberOfColumns() - 1)) {
        csvColumns += ',';
      }
    }
    csvColumns += '\n';

    // build data rows
    csvContent = csvColumns + google.visualization.dataTableToCsv(dataTable);

    // export data
    downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    downloadLink.download = fileName;
    downloadLink.click();

    URL.revokeObjectURL(downloadLink);
}
    
function downloadMapAsPng() {
    
    leafletImage(map, async function (err, canvas) {
        const dataURL = await canvas.toDataURL();

        let link = document.createElement('a');

        link.href = dataURL;
        link.download = 'map.png';
        link.click();
        URL.revokeObjectURL(link);
    });
}

function downloadMapAsCsv() {
    let csvColumns = '';
    let csvContent = "Country,City,Date,Organization,Attack Type,Target Type,Summary,Motive\n";

    let downloadLink;
    const fileName = 'map.csv';
    markers.forEach(function(marker){
        const info = marker.getTooltip().getContent();
        let startTag = '<div style="display: none;">';
        let endTag = '</div>';
        
        let startIndex = info.indexOf(startTag);
        let endIndex = info.indexOf(endTag, startIndex + startTag.length);
        let extractedContent = info.substring(startIndex + startTag.length, endIndex);
        csvContent += extractedContent;
        csvContent += '\n';
    });
    downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    downloadLink.download = fileName;
    downloadLink.click();

    URL.revokeObjectURL(downloadLink);
}