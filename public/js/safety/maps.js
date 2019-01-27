var mapboxAccessToken = '';
var map = L.map('crimeMap').setView([36.78, -76.00], 10);


function getColor(d) {
    
    return  d > 80 ? '#993404' :
        d > 50 ? '#d95f0e' :
        d > 20 ? '#fe9929' :
        d > 10 ? '#fed98e' :
        '#ffffd4';
}

function style(feature) {
    console.log(feature.properties.incidents.length);
    return {
        fillColor: getColor(feature.properties.incidents.length),
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

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 80],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Police Incidents by Patrol Zone (past 30 days)</h4>' +  (props ?
        '<b>' + props.BEAT + '</b><br />' + props.incidents.length + ' incidents'
        : '');
};

info.addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer) {
    console.log("nnnnnn")
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

var patrol_zone_boundary = new L.geoJson();
patrol_zone_boundary.addTo(map, {
    onEachFeature: onEachFeature
});

$.ajax({
    dataType: "json",
    url: "https://gis.data.vbgov.com/datasets/82ada480c5344220b2788154955ce5f0_9.geojson",
    success: function (data) {

        var locations = $("#locations").val();
        //console.log(locations);
        locations = JSON.parse(locations);

        if (locations['Virginia']) {
            DataDirectory = 'VirginiaBeach'.split('.').reduce((o, i) => o[i], locations['Virginia']);
        }

        getCountWithinDays(DataDirectory.police.incidents, [-76.00, 36.78], 40, 30, "police-incidents").then(function (incidents) {
            if (incidents) {
                $(data.features).each(function (key, data) {
                    //console.log(data.properties.BEAT);
                    var incidentsInBeat = $(incidents).filter(function(index) {
                        return incidents[index].zone_id == data.properties.BEAT;
                    })
                    data.properties.incidents = incidentsInBeat;
                    patrol_zone_boundary.addData(data);
                });
                patrol_zone_boundary.setStyle(style);
            }
        });
    }
}).error(function () {});
