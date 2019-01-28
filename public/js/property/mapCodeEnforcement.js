var mapboxAccessToken = $("#mapboxKey").val();;
var map = L.map('codeEnforcementMap').setView([36.78, -76.00], 11);

var zipCode_boundary = null;

var locations = $("#locations").val();
//console.log(locations);
locations = JSON.parse(locations);

if (locations['Virginia']) {
    DataDirectory = 'VirginiaBeach'.split('.').reduce((o, i) => o[i], locations['Virginia']);
}


function getColor(d) {
    
    return d>=50 ? '#990000' : 
        d >40 ? '#d7301f' :
        d > 20 ? '#ef6548' :
        d > 15 ? '#fc8d59' :
        d > 10 ? '#fdbb84' :
        d > 1 ? '#fdd49e' :
        '#eeeeee';
}

function style(feature) {
    console.log(feature.properties.enforcements.length);
    return {
        fillColor: getColor(feature.properties.enforcements.length),
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
        grades = [0, 1, 10, 15, 20, 40, 50],
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
    this._div.innerHTML = '<h4>Code Enforcements by Subdivision (past 180 days)</h4>' +  (props ?
        '<b>Zip Code: ' + props.SUBD_DESC + '<br />' + props.enforcements.length + ' enforcements</b>'
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
    if (zipCode_boundary)
    {
        zipCode_boundary.resetStyle(e.target);
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
    url: "https://gis.data.vbgov.com/datasets/759ad66064974eab9a556d3a90efa1a1_23.geojson",
    success: function (data) {

        getCountWithinDays(DataDirectory.property.code_enforcement, [-76.00, 36.78], 40, 180, "code-enforcement").then(function (enforcements) {
            if (enforcements) {
                $(data.features).each(function (key, data) {
                    var enforcementsInZipCode = $(enforcements).filter(function(index) {
                        //return enforcements[index].zip_code.startsWith(data.properties.ZIP_CODE);
                        //console.log(enforcements[index].sub_division);
                        return enforcements[index].sub_division == data.properties.SUBD_DESC;
                    })
                    data.properties.enforcements = enforcementsInZipCode;
                });
                zipCode_boundary = new L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                });
                zipCode_boundary.addTo(map);
            }
        });
    }
});
