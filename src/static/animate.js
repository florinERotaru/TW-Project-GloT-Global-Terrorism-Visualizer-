var map = L.map('map').setView([21, 78], 3);

var myIcon = L.icon({
  iconUrl: '/static/images/terrorist.png',
  iconSize: [35, 32],
  iconAnchor: [25, 16]
});

const marker = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}).addTo(map);

const markers = [];

document.getElementById('mapForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  markers.forEach(function(marker) {
    map.removeLayer(marker);
  });
  markers.length = 0; // Clear the markers array

  const form = event.target;
  const url = form.getAttribute('action');
  const queryParams = new URLSearchParams(new FormData(form)).toString();
  const fullUrl = url + '?' + queryParams;
  //here i receive jsons about attacks
  fetch(fullUrl)
    .then(response => {
      console.log('Form submission successful');
      // history.pushState(null, null, fullUrl);
      if (response.ok) {  
        return response.json();
      } else {
        throw new Error(response.status);
      } 
    })
    .then(jsonList =>{
      jsonList.forEach(item =>{
        const latitude = item.latitude;
        const longitude = item.longitude;
        if(latitude && longitude)
        {
            const marker= L.marker([latitude, longitude], {icon: myIcon}).addTo(map);
            const tooltipContent = `<div class = "custom-tooltip">
                                    <strong>Location:</strong> ${item.city}, ${item.country}
                                    <br>
                                    <strong>Date:</strong> ${item.date}
                                    <br>
                                    <strong>Organization:</strong> ${item.organization}
                                    <br>
                                    ${item.attacktype} against ${item.targtype}
                                    </div>`;

            marker.bindTooltip(tooltipContent, {
              className: 'custom-tooltip'
            });
            markers.push(marker);

        }
      })
    })
    .catch(error => {
      if (error.message === '400'){
        Swal.fire({
          title: 'Please provide a valid time interval.',
          confirmButtonColor: '#000000', // Black color for the button
          background: '#ffffff', // White background color
        });
        
      } else {
        console.error('Error submitting form:', error);
      }
    });
});

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}