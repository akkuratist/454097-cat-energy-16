var navMain = document.querySelector('.main-nav');
var menuToggle = document.querySelector('.page-header__menu-toggle');

menuToggle.classList.remove('page-header__menu-toggle--nojs');
menuToggle.classList.add('page-header__menu-toggle--closed');
navMain.classList.remove('main-nav--nojs');
navMain.classList.add('main-nav--closed');

menuToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
    menuToggle.classList.remove('page-header__menu-toggle--closed');
    menuToggle.classList.add('page-header__menu-toggle--opened');

  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
    menuToggle.classList.add('page-header__menu-toggle--closed');
    menuToggle.classList.remove('page-header__menu-toggle--opened');
  }
});

function initMap() {
  var catEnergyLocation = {lat: 59.9387, lng: 30.3231};
  var map = new google.maps.Map(
      document.getElementById('catEnergyMap'), {zoom: 18, center: catEnergyLocation});
  var mapPin = '../img/map-pin.png';

  var marker = new google.maps.Marker({
    position: catEnergyLocation,
    map: map,
    icon: mapPin});
}
