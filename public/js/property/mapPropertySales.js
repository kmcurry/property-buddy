var mapboxAccessToken = $("#mapboxKey").val();;
var map = L.map('propertySalesMap').setView([36.78, -76.00], 10);

var zipCode_boundary = null;

var locations = $("#locations").val();
locations = JSON.parse(locations);

if (locations['Virginia']) {
    DataDirectory = 'VirginiaBeach'.split('.').reduce((o, i) => o[i], locations['Virginia']);
}


function getColor(d) {
    
    return d >=45 ? '#4a1486' :
        d > 40 ? '#6a51a3' :
        d > 35 ? '#807dba' :
        d > 30 ? '#9e9ac8' :
        d > 25 ? '#bcbddc' :
        d > 10 ? '#dadaeb' :
        '#eeeeee';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.sales.length),
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
        grades = [0, 10, 25, 30, 35, 40, 45],
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
    this._div.innerHTML = '<h4>Property Sales by Zip Code (past 30 days)</h4>' +  (props ?
        '<b>Zip Code: ' + props.ZIP_CODE + '<br />' + props.sales.length + ' sales</b>'
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
    url: "https://gis.data.vbgov.com/datasets/82ada480c5344220b2788154955ce5f0_1.geojson",
    success: function (data) {

        getCountWithinDays(DataDirectory.property.sales, [-76.00, 36.78], 40, 30, "property-sales").then(function (sales) {
            if (sales) {
                $(data.features).each(function (key, data) {
                    var salesInZipCode = $(sales).filter(function(index) {
                        if(sales[index].zip_code) {
                            return sales[index].zip_code.startsWith(data.properties.ZIP_CODE);
                        }
                        
                    })
                    data.properties.sales = salesInZipCode;
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
