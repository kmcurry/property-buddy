// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

var geolocation = {};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById('autocomplete')), {
      types: ['geocode']
    });

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', searchPlace);
}

function searchPlace() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  if (place.geometry) {
    var pos = [2];
    pos[0] = place.geometry.location.lat();
    pos[1] = place.geometry.location.lng();

    document.location.href = "/search/" + pos.join(',');
  }

}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      //autocomplete.setBounds(circle.getBounds());
    });
  }
}

function getSpotFax() {
  if (navigator.geolocation) {
    $("#autocomplete").attr("placeholder", "Fetching location...");
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = [position.coords.latitude, position.coords.longitude];
      document.location.href = "/search/" + pos.join(',');
    });
  }
}

function getSpotSafety() {
  if (navigator.geolocation) {
    $("#autocomplete").attr("placeholder", "Fetching location...");
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = [position.coords.latitude, position.coords.longitude];
      document.location.href = "/search/safety/" + pos.join(',');
    });
  }
}

function getSpotPrices() {
  if (navigator.geolocation) {
    $("#autocomplete").attr("placeholder", "Fetching location...");
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = [position.coords.latitude, position.coords.longitude];
      document.location.href = "/search/prices/" + pos.join(',');
    });
  }
}

$(document).ready(function() {
  $(document).tooltip();
})

$('#form').on('keyup keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});
