var mapboxAccessToken = $("#mapboxKey").val();;
var map = L.map('floodReportMap');


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$(document).ready(function () {
    var ll = [36.78, -76.00];
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            ll[0] = position.coords.latitude;
            ll[1] = position.coords.longitude;
            map.setView(ll, 20);
            L.marker(ll).addTo(map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                .openPopup();
        });
    } else {
        map.setView(ll, 13);
        L.marker(ll).addTo(map)
            .bindPopup('Location could not be determined.')
            .openPopup();
    }
});