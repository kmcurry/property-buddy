var mapboxAccessToken = $("#mapboxKey").val();;
var mapCalls = L.map('callsMap').setView([36.78, -76.00], 10);

var patrol_zone_boundary_calls = null;

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

function styleCalls(feature) {
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
}).addTo(mapCalls);

var mapCallsLegend = L.control({position: 'bottomright'});

mapCallsLegend.onAdd = function (mapCalls) {

    var div = L.DomUtil.create('div', 'mapCallsInfo mapCallsLegend'),
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

mapCallsLegend.addTo(mapCalls);

var mapCallsInfo = L.control();

mapCallsInfo.onAdd = function (mapCalls) {
    this._div = L.DomUtil.create('div', 'mapCallsInfo'); // create a div with a class "mapCallsInfo"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
mapCallsInfo.update = function (props) {
    this._div.innerHTML = '<h4>Police Calls by Patrol Zone (past 30 days)</h4>' +  (props ?
        '<b>Patrol Zone: ' + props.BEAT + '<br />' + props.calls.length + ' calls</b>'
        : '');
};

mapCallsInfo.addTo(mapCalls);

function highlightCallsFeature(e) {
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

    mapCallsInfo.update(layer.feature.properties);
}

function resetCallsHighlight(e) {
    if (patrol_zone_boundary_calls)
    {
        patrol_zone_boundary_calls.resetStyle(e.target);
        mapCallsInfo.update();
    }  
}

function onEachCallsFeature(feature, layer) {
    layer.on({
        mouseover: highlightCallsFeature,
        mouseout: resetCallsHighlight
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
                patrol_zone_boundary_calls = new L.geoJson(data, {
                    style: styleCalls,
                    onEachFeature: onEachCallsFeature
                });
                patrol_zone_boundary_calls.addTo(mapCalls);
            }
        });
    }
});
