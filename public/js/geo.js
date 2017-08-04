var config = {};

function getFeaturesForLocation(position) {

  console.log("Checking features for position:");
  console.log(position);

  // LON LAT unless locally manipulated b/c D3 is LON LAT
  var ll = [position.coords.longitude, position.coords.latitude];

  d3.json(config.Norfolk.boundary, function(error, mapData) {
    console.log("Checking " + ll + " in NFK");
    var features = mapData.features[0];
    if (d3.geoContains(features, ll)) {
      console.log("Location is NFK");
      var msg = "<p class='p-sm'>You are in Norfolk</p>";
      d3.select("#location").html(msg);
      getAICUZ(config.Norfolk.AICUZ, ll, "NFK");
      getFloodZone(config.Norfolk.FIRM, ll);
      getParks(config.Norfolk.parks, ll);
      getClosestLibrary(config.Norfolk.libraries, ll);
      getClosestHydrant(config.Norfolk.hydrants, ll);
      getClosestRecCenter(config.Norfolk.recCenters, ll);
    } else {
      console.log("Location is not in NFK")
    }
  });

  d3.json(config.VirginiaBeach.boundary, function(error, mapData) {
    console.log("Checking " + ll + " in VB");
    var features = mapData.features[0];
    if (d3.geoContains(features, ll)) {
      console.log("Location is VB");
      var msg = "<p class='p-sm'>You are in Virginia Beach</p>";
      d3.select("#location").html(msg);
      getAICUZ(config.VirginiaBeach.AICUZ, ll);
      getFloodZone(config.VirginiaBeach.FIRM, ll);
      getSchools(config.VirginiaBeach.schools.elementary, ll, "Elementary");
      getSchools(config.VirginiaBeach.schools.middle, ll, "Middle");
      getSchools(config.VirginiaBeach.schools.high, ll, "High");
      getParks(config.VirginiaBeach.parks, ll);
      getClosestLibrary(config.VirginiaBeach.libraries, ll);
      getClosestHydrant(config.VirginiaBeach.hydrants, ll);
      getClosestRecCenter(config.VirginiaBeach.recCenters, ll);
      getAverageEMSResponseTime(config.VirginiaBeach.EMSCalls, ll, 3);
    } else {
      console.log("Location is not in VB")
    }
  });

}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getFeaturesForLocation);
  } else {
    d3.select("body").append("span")
      .text("Geolocation is not supported by this browser.");
  }
}

function getAICUZ(url, ll) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "<p class='preamble'>AICUZ Noise Level</p>";

      var z = checkFeaturesForAICUZNoiseLevel(data.features, ll);

      msg += z;

      d3.select("#aicuz").html(msg);

    });
}

function getAverageEMSResponseTime(url, ll, d) {

  d = d * 1609.35;

  url += "?$where=within_circle(location_1," + ll[1] + "," + ll[0] + "," + d + ")"

  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "<p class='preamble'>Average EMS Response Time</p>";

      var z = getAverageTime(data, ll);
      //var z = "<p>" + data.length + "</p>";

      msg += z;

      d3.select("#ems").html(msg);

    });

}

function getClosestHydrant(url, ll) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "<p class='preamble'>Closest Public Fire Hydrant</p>";

      var z = getClosestItem(data.features, ll);

      msg += z;

      d3.select("#hydrants").html(msg);

    });
}

function getClosestLibrary(url, ll) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "<p class='preamble'>Closest Library</p>";

      var z = getClosestItem(data.features, ll);

      msg += z;

      d3.select("#libraries").html(msg);

    });
}

function getClosestRecCenter(url, ll) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "<p class='preamble'>Closest Recreation Center</p>";

      var z = getClosestItem(data.features, ll);

      msg += z;

      d3.select("#recCenters").html(msg);

    });
}

// TODO: update from 2009 to 2015. Something wrong with the 2015 API
function getFloodZone(url, ll) {
  var LL = L.latLng(ll[1],ll[0]);
  // use location to find out which census block they are inside.
    L.esri.query({
      url: url
    }).intersects(LL).run(function(error, floodZones){
      var msg = "<p class='preamble'>Flood Zone</p>";

      msg += checkFeaturesForFloodZone(floodZones.features, ll);

      d3.select("#flood").html(msg);

    });
}

function getParks(url, ll) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "<p>Parks within 3 miles</p>";

      var z = getItemsForFeatures(data.features, ll, 3);

      msg += z;

      d3.select("#parks").html(msg);

    });
}

function getSchools(url, ll, type) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "<p class='preamble'>" + type + "</p>";

      var z = getItemsForFeatures(data.features, ll, 3);

      msg += z;

      d3.select("#"+type).html(msg);

    });
}

function getAverageTime(data) {
  var msg = "";
  var avg = 0;
  $(data).each(function() {
    var d = $(this);
    if (d && d[0]) {
      d = d[0];
      var callTime = new Date(d.call_date_and_time);
      var onSceneTime = new Date(d.on_scene_date_and_time);
      var duration = onSceneTime.getTime() - callTime.getTime();
      if (!isNaN(duration)) {
        avg += duration;
      }
    }
  });

  avg = (avg/data.length)/1000/60;
  avg = avg.toFixed(2);

  msg += "<p>" + avg + " minutes</p>";

  return msg;
}

function getClosestItem(features, ll) {
  var msg = "";
  var closest = 99;
  $(features).each(function() {
    var f = $(this);
    //console.log(f[0]);
    if (f && f[0]) {
      var dist = d3.geoDistance(f[0].geometry.coordinates, ll);
      if (dist < closest) {
        closest = dist;
      }
    }
  });
  closest = parseFloat(closest)*3959;
  closest = closest.toFixed(2);

  msg += "<p>" + closest + " miles </p>";

  return msg;
}

function getItemsForFeatures(features, ll, d) {
  var msg = "";
  var count = 0;
  $(features).each(function() {
    var f = $(this);
    //console.log(f[0]);
    if (f && f[0]) {
      var dist = d3.geoDistance(f[0].geometry.coordinates, ll);
      var max = d/3959;
      if (dist < max) {
        ++count;
      }
    }
  });
  msg += "<p>" + count + "</p>";

  return msg;
}

function checkFeaturesForAICUZNoiseLevel(features, ll) {
  var msg = "";
  var lvl = 0;
  $(features).each(function() {
    var f = $(this);
    if (f && f[0]) {
      if (d3.geoContains(f[0], ll)) {
        if (f[0].properties.NOISE_LEV_) {
          lvl = parseInt(f[0].properties.NOISE_LEV_);
        } else if (f[0].properties.ZONE_) {
          lvl = parseInt(f[0].properties.ZONE_);
        } else {
          lvl = 0;
        }
        return lvl;
      }
    }
  });

  msg += "<p class='p-lg'>" + lvl + "</p>";


  switch (lvl) {
    case 0: {
      d3.select("#aicuz").classed("_0", true);
    }
    case 50:
      {
        d3.select("#aicuz").classed("_50", true);
      }
      break;
    case 55:
      {
        d3.select("#aicuz").classed("_55", true);
      }
      break;
    case 60:
      {
        d3.select("#aicuz").classed("_60", true);
      }
      break;
    case 65:
      {
        d3.select("#aicuz").classed("_65", true);
      }
      break;
    case 70:
      {
        d3.select("#aicuz").classed("_70", true);
      }
      break;
    case 75:
      {
        d3.select("#aicuz").classed("_75", true);
      }
      break;
    case 80:
      {
        d3.select("#aicuz").classed("_80", true);
      }
      break;
    case 85:
      {
        d3.select("#aicuz").classed("_85", true);
      }
      break;
  }

  return msg;
}

function checkFeaturesForFloodZone(features, ll) {
  var msg = "<p class='flood'>You are not in any flood zone</p>";;
  $(features).each(function() {
    var f = $(this);
    if (f && f[0]) {
      if (d3.geoContains(f[0], ll)) {
        var fz = f[0].properties.FLD_ZONE;
        msg = "<p class=''>" + fz + "</p>";
        switch (fz) {
          case "X": {
            msg += "<div class=''><p class=''>Flood insurance is</p><p>NOT REQUIRED</p></div>";
          }
          break;
          case "A":
          case "AE":
          case "AH":
          case "AO":
          case "AR": {
            msg += "<div class='alert-warning'><p class=''>Flood insurance</p><p>IS REQUIRED</p></div>";
          }
          break;
          default: {
            if (fz.indexOf("0.2") !== -1) {
              msg = "<p class='p-sm'>" + fz + "</p>";
              msg += "<div class=''><p class=''>Flood insurance is NOT REQUIRED.</p></div>"
            } else {
              msg += "<div class=''><p class=''>Your flood zone could not be determined</p></div>";
            }
          }
          break;
        }

        return;
      }
    }
  });
  return msg;
}

$(document).ready(function() {
  config = JSON.parse($("#config").val());
  getLocation();
})
