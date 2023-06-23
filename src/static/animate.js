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
      history.pushState(null, null, fullUrl);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      } 
    })
    .then(jsonList =>{
      let attackCtr = 0;
      jsonList.forEach(item =>{
        const latitude = item.latitude;
        const longitude = item.longitude;
        if(latitude && longitude)
        {
            if (attackCtr++ > 4000){
              return
            }
            const marker= L.marker([latitude, longitude], {icon: myIcon}).addTo(map);
            if (item.summary == null) {
              item.summary = '';
            }
            if (item.motive == null) {
              item.motive = '';
            }
            const tooltipContent = `<div class = "custom-tooltip">
                                    <strong>Location:</strong> ${item.city}, ${item.country}
                                    <br>
                                    <strong>Date:</strong> ${item.date}
                                    <br>
                                    <strong>Organization:</strong> ${item.organization}
                                    <br>
                                    ${item.attacktype} against ${item.targtype}
                                    </div>
                                    <div style="display: none;">${item.country},${item.city},${item.date},${item.organization},${item.attacktype},${item.targtype},${item.summary.replaceAll(',', '') || 'Unknown'},${item.motive || 'Unknown'}</div>`;

            marker.bindTooltip(tooltipContent, {
              className: 'custom-tooltip'
            });
            markers.push(marker);

            marker.on('click', function() {
              handleMarkerClick(item);
            });
            
        }
      });
      drawChart(jsonList);
    })
    .catch(error => {
      if (error.message === '400'){
        Swal.fire({
          title: 'Form is not filled in correctly.',
          confirmButtonColor: '#000000', // Black color for the button
          background: '#ffffff', // White background color
        });
        
      } else {
        console.error('Error submitting form:', error);
      }
    });
});

function handleMarkerClick(item) {
  // Send a request to the server
  const itemId = item.id;
  const url = `/api/map/attack/${itemId}`;
  fetch(url, {
    method: 'GET'
  })
    .then(response => {
      if (response.ok) {
        return response.json(); 
      } else {
        throw new Error('Request failed');
      }
    })
    .then(data => {
      const date = new Date(item.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      // Handle the server response here
      const markerDetailsPanel = document.getElementById('marker-details');
      let markerDetailsContent = `
      <div style="overflow:auto; height: 82.9vh;">
        <p><strong style="font-size: 34px;">Attack Details</strong></p>
        <p><strong>${formattedDate}, ${item.city}, (${item.country})</strong></p>
        <p><strong>Summary:</strong> <span style="color: green;">${item.summary == null? 'Unknown':item.summary}</span></p>
        <p><strong>Fatalities:</strong> ${item.killed} killed, ${parseFloat(item.wounded)} wounded</p>
        <p><strong>Material damages:</strong> ${item.property_comment == null? 'Unknown':item.property_comment} </p>
        <p><strong>Attacker & Motives:</strong> ${item.organization}, ${item.motive == null? 'Unknown':item.motive} </p>
        <p><strong>Weapon:</strong> ${item.weapons == null? 'Unknown weapon':item.weapon}, ${item.weapon_detail == null? 'Unknown details':item.weapon_detail} </p>`;
      data.forEach((victimEntry) => {
        markerDetailsContent += `
          <p><strong>Target:</strong> ${victimEntry.victim}, (${victimEntry.targsubtype})</p>
        `;
      });
      markerDetailsContent+='</div>';
      markerDetailsPanel.innerHTML = markerDetailsContent;
      markerDetailsPanel.style.display = 'block'; // Show the panel
      const element = document.getElementById('marker-details'); // Replace 'elementId' with the actual ID of the element
      element.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error);
    });
}

let hasFetchedOrgs = false;
function fetchOrganizationsAndPopulateSelect() {
    fetch('/api/map/organizations')
    .then(response => response.json())
    .then(organizations => {
      const organizationSelect = document.getElementById('Organization');
      organizationSelect.innerHTML = '';
      organizations.forEach(organization => {
        const option = document.createElement('option');
        option.value = organization.name; // Assuming organization object has an 'id' property
        option.textContent = organization.name; // Assuming organization object has a 'name' property
        organizationSelect.appendChild(option);
        
      });
      const option = document.createElement('option');
      option.value = 'Any'; // Assuming organization object has an 'id' property
      option.textContent = 'Any'; // Assuming organization object has a 'name' property
      organizationSelect.appendChild(option);
    })
    .catch(error => {
      console.error('Error fetching organizations:', error);
    });
}
// Add event listener to the select element
const organizationSelect = document.getElementById('Organization');
organizationSelect.addEventListener('click', function(event){
  if (!hasFetchedOrgs) {
    fetchOrganizationsAndPopulateSelect();
    hasFetchedOrgs = true; // Set the flag to true after the first fetch request
  }
  event.stopPropagation
});























let slideIndex = 1;
showSlides(slideIndex);

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex-1].style.display = "block";
}