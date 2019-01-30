var mapboxAccessToken = $("#mapboxKey").val();;
var mapIncidents = L.map('incidentsMap').setView([36.78, -76.00], 10);

var patrol_zone_boundary_incidents_incidents = null;


function getColor(d) {
    
    return  d >= 70 ? '#993404' :
        d > 50 ? '#d95f0e' :
        d > 20 ? '#fe9929' :
        d > 10 ? '#fed98e' :
        '#ffffd4';
}

function style(feature) {
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
}).addTo(mapIncidents);

var mapIncidentsLegend = L.control({position: 'bottomright'});

mapIncidentsLegend.onAdd = function (mapIncidents) {

    var div = L.DomUtil.create('div', 'mapIncidentsInfo mapIncidentsLegend'),
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

mapIncidentsLegend.addTo(mapIncidents);

var mapIncidentsInfo = L.control();

mapIncidentsInfo.onAdd = function (mapIncidents) {
    this._div = L.DomUtil.create('div', 'mapIncidentsInfo'); // create a div with a class "mapIncidentsInfo"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
mapIncidentsInfo.update = function (props) {
    this._div.innerHTML = '<h4>Police Incidents by Patrol Zone (past 30 days)</h4>' +  (props ?
        '<b>Patrol Zone: ' + props.BEAT + '<br />' + props.incidents.length + ' incidents</b>'
        : '');
};

mapIncidentsInfo.addTo(mapIncidents);

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

    mapIncidentsInfo.update(layer.feature.properties);
}

function resetHighlight(e) {
    if (patrol_zone_boundary_incidents)
    {
        patrol_zone_boundary_incidents.resetStyle(e.target);
        mapIncidentsInfo.update();
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

        var locations = $("#locations").val();
        //console.log(locations);
        locations = JSON.parse(locations);

        if (locations['Virginia']) {
            DataDirectory = 'VirginiaBeach'.split('.').reduce((o, i) => o[i], locations['Virginia']);
        }

        getCountWithinDays(DataDirectory.police.incidents, [-76.00, 36.78], 40, 30, "police-incidents").then(function (incidents) {
            if (incidents) {
                $(data.features).each(function (key, data) {
                    var incidentsInBeat = $(incidents).filter(function(index) {
                        return incidents[index].zone_id == data.properties.BEAT;
                    })
                    data.properties.incidents = incidentsInBeat;
                });
                patrol_zone_boundary_incidents = new L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                });
                patrol_zone_boundary_incidents.addTo(mapIncidents);
            }
        });
    }
});
