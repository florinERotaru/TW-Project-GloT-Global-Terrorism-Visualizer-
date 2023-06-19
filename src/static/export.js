function downloadChartAsSvg() { // WIP
    const chartDiv = document.getElementById('myPieChart');
    const chartSVG = chartDiv.innerHTML;

    const svgBlob = new Blob([chartSVG], { type: 'image/svg+xml' });
 
    const svgURL = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.href = svgURL;
    link.download = 'chart.svg';
    link.click();
}

function downloadChartAsPng() {
    // Create a link element to download the PNG image
    const link = document.createElement('a');
    link.href = imageURI;
    link.download = 'piechart.png';
    link.click();
}
    
function downloadMapAsPng() {
    leafletImage(map, function (err, canvas) {
        var dataURL = canvas.toDataURL();

        var link = document.createElement('a');

        link.href = dataURL;
        link.download = 'map.png';
        link.click();
        URL.revokeObjectURL(link);
    });
}