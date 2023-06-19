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
}
    
function downloadMapAsPng() {
    // asta dureaza mai mult, ar trebui un loading animation sau ceva
    leafletImage(map, function (err, canvas) {
        var dataURL = canvas.toDataURL();

        var link = document.createElement('a');

        link.href = dataURL;
        link.download = 'map.png';
        link.click();
        URL.revokeObjectURL(link);
    });
}