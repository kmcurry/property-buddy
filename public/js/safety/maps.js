var mapboxAccessToken = 'pk.eyJ1Ijoia21jdXJyeSIsImEiOiJjanJjMjhzY2ExOTVwNDRwZzN3MmlseW0zIn0.Fjle-Wpb4DTEhN_AaY-xXg';
var map = L.map('crimeMap').setView([36.78, -76.00], 10);


function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
        d > 100 ? '#FC4E2A' :
        d > 50 ? '#FD8D3C' :
        d > 20 ? '#FEB24C' :
        d > 10 ? '#FED976' :
        '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: '#FEB24C',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'
}).addTo(map);

var patrol_zone_boundary = new L.geoJson();
patrol_zone_boundary.addTo(map, {
    style: style
});

$.ajax({
    dataType: "json",
    url: "https://gis.data.vbgov.com/datasets/82ada480c5344220b2788154955ce5f0_9.geojson",
    success: function (data) {
        $(data.features).each(function (key, data) {
            patrol_zone_boundary.addData(data);
        });

        var locations = $("#locations").val();
        //console.log(locations);
        locations = JSON.parse(locations);

        if (locations['Virginia']) {
            DataDirectory = 'VirginiaBeach'.split('.').reduce((o, i) => o[i], locations['Virginia']);
        }

        getCountWithinDays(DataDirectory.police.incidents, [-76.00, 36.78], 40, 30, "police-incidents").then(function (incidents) {
            if (incidents) {
                console.log(incidents);
            }
        });
    }
}).error(function () {});