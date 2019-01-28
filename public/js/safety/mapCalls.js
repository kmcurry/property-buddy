var mapboxAccessToken = $("#mapboxKey").val();;
var map = L.map('callsMap').setView([36.78, -76.00], 10);

var patrol_zone_boundary = null;

var locations = $("#locations").val();
//console.log(locations);
locations = JSON.parse(locations);

if (locations['Virginia']) {
    DataDirectory = 'VirginiaBeach'.split('.').reduce((o, i) => o[i], locations['Virginia']);
}


function getColor(d) {
    
    return  d >=70 ? '#993404' :
        d > 50 ? '#d95f0e' :
        d > 20 ? '#fe9929' :
        d > 10 ? '#fed98e' :
        '#ffffd4';
}

function style(feature) {
    console.log(feature.properties.calls.length);
    return {
        fillColor: getColor(feature.properties.calls.length),
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
        grades = [0, 10, 20, 50, 70],
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
    this._div.innerHTML = '<h4>Police Calls by Patrol Zone (past 30 days)</h4>' +  (props ?
        '<b>Patrol Zone: ' + props.BEAT + '<br />' + props.calls.length + ' calls</b>'
        : '');
};

info.addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#339',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    if (patrol_zone_boundary)
    {
        patrol_zone_boundary.resetStyle(e.target);
        info.update();
    }  
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

$.ajax({
    dataType: "json",
    url: "https://gis.data.vbgov.com/datasets/82ada480c5344220b2788154955ce5f0_9.geojson",
    success: function (data) {

        getCountWithinDays(DataDirectory.police.calls, [-76.00, 36.78], 40, 30, "police-calls").then(function (calls) {
            if (calls) {
                $(data.features).each(function (key, data) {
                    var callsInBeat = $(calls).filter(function(index) {
                        return calls[index].zone == data.properties.BEAT;
                    })
                    data.properties.calls = callsInBeat;
                });
                patrol_zone_boundary = new L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                });
                patrol_zone_boundary.addTo(map);
            }
        });
    }
});