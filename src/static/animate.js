$(document).ready(function() {
            $('.scrollable').click(function() {
              var id = $(this).attr('id');
              $('html, body').animate({
                scrollTop: ($('#' + id + '.section').offset().top)
              }, 500);
            });})

var map = L.map('map').setView([21, 78], 3);

var myIcon = L.icon({
  iconUrl: '/static/images/terrorist.png',
  iconSize: [35, 32],
  iconAnchor: [25, 16]
});


const marker1 = L.marker([30, 80], {icon: myIcon}).addTo(map);
const marker2 = L.marker([36, 50], {icon: myIcon}).addTo(map);
const marker3 = L.marker([20, 30], {icon: myIcon}).addTo(map);
const marker4 = L.marker([24, 50], {icon: myIcon}).addTo(map);

const marker5 = L.marker([60, 76], {icon: myIcon}).addTo(map);


L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}).addTo(map);


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