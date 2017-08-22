var config = {};
var searchPosition = [];

function getFeaturesForLocation(position) {

  console.log("Checking features for position:");
  console.log(position);

  var ll = null;

  // LON LAT unless locally manipulated b/c D3 is LON LAT
  if (position.coords) {
    ll = [position.coords.longitude, position.coords.latitude];
  } else {
    ll = [position[1], position[0]];
  }

  // TODO: Don't need to check the city again if form was used

  d3.json(config.Norfolk.boundary, function(error, mapData) {
    console.log("Checking " + ll + " in NFK");
    var features = mapData.features[0];
    if (d3.geoContains(features, ll)) {
      console.log("Location is NFK");
      var msg = "<p class='p-sm'>You are in Norfolk</p>";
      d3.select("#location").html(msg);
      getAICUZ(config.Norfolk.AICUZ, ll);
      getFloodZone(config.Norfolk.FIRM, ll);
      // getSchools(config.VirginiaBeach.schools.elementary, ll, 3, "Elementary");
      // getSchools(config.VirginiaBeach.schools.middle, ll, 3, "Middle");
      // getSchools(config.VirginiaBeach.schools.high, ll, 3, "High");
      getParks(config.Norfolk.parks, ll, 1);
      getClosestThing(config.Norfolk.parks, ll, "park");
      getClosestThing(config.Norfolk.libraries, ll, "library");
      getClosestThing(config.Norfolk.hydrants, ll, "hydrant", "feet");
      getClosestThing(config.Norfolk.recCenters, ll, "recCenter");
      getNearbyNeighborhoods(config.Norfolk.neighborhoods, ll, 1, "neighborhoods")
      getAverageResponseTime(config.Norfolk.emergency.calls, ll, .25, "ems");
      getAverageResponseTime(config.Norfolk.police.calls, ll, .25, "police");
      getCountWithinDays(config.Norfolk.police.incidents, ll, 1, 30, "police-incidents");
      getCountWithinDays(config.Norfolk.police.calls, ll, 1, 30, "police-calls");
    } else {
      console.log("Location is not in NFK")
    }
  });

  d3.json(config.VirginiaBeach.boundary, function(error, mapData) {
    console.log("Checking " + ll + " in VB");
    var features = mapData.features[0];
    if (d3.geoContains(features, ll)) {
      console.log("Location is VB");
      var msg = "Virginia Beach";
      d3.select("#city").html(msg);
      getAICUZ(config.VirginiaBeach.AICUZ, ll);
      getFloodZone(config.VirginiaBeach.FIRM, ll);
      // getSchools(config.VirginiaBeach.schools.elementary, ll, 3, "Elementary");
      // getSchools(config.VirginiaBeach.schools.middle, ll, 3, "Middle");
      // getSchools(config.VirginiaBeach.schools.high, ll, 3, "High");
      getParks(config.VirginiaBeach.parks, ll, 1);
      getClosestThing(config.VirginiaBeach.parks, ll, "park");
      getClosestThing(config.VirginiaBeach.libraries, ll, "library");
      getClosestThing(config.VirginiaBeach.hydrants, ll, "hydrant", "feet");
      getClosestThing(config.VirginiaBeach.recCenters, ll, "recCenter");
      getNearbyNeighborhoods(config.VirginiaBeach.neighborhoods, ll, 1, "neighborhoods")
      getAverageResponseTime(config.VirginiaBeach.emergency.calls, ll, .25, "ems");
      getAverageResponseTime(config.VirginiaBeach.police.calls, ll, .25, "police");
      getCountWithinDays(config.VirginiaBeach.police.incidents, ll, 1, 30, "police-incidents");
      getCountWithinDays(config.VirginiaBeach.police.calls, ll, 1, 30, "police-calls");

    } else {
      console.log("Location is not in VB")
    }
  });

}

function getAICUZ(url, ll) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "";
      if (data) {
        msg = checkFeaturesForAICUZNoiseLevel(data.features, ll);
      } else {
          msg = "No data. Please refresh the page.";
      }

      d3.select("#aicuz").html(msg);

    });
}

function getAverageResponseTime(url, ll, d, type) {

  d = d * 1609.35;

  url += "?$where=within_circle(location_1," + ll[1] + "," + ll[0] + "," + d + ")"

  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      console.log("Response records: " + data.length);

      var msg = getAverageTime(data, ll);
      //var z = "<p>" + data.length + "</p>";

      msg += "<a title='1/4 Mile Avg response time based on " + data.length + " records' href=''>*</a>";

      d3.select("#" + type + "-response-avg").html(msg);

    });

}

function getClosestThing(url, ll, thing, units) {
  if (!url) {
    d3.select("#closest-" + thing).html("Needs data source");
    return;
  }

  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var closest = getClosestItem(data.features, ll);

      var msg = "";

      switch (units) {
        case "feet": {
          msg = parseInt(closest.distance * 5280) + " feet";
        }
        break;
        default: {
          msg = closest.distance + " miles";
        }
      }


      d3.select("#closest-" + thing).html(msg);

    });
}

function getCountWithinDays(url, ll, dist, days, type) {
  dist = dist * 1609.35;

  var checkDate = new Date();
  checkDate = new Date(checkDate.setDate(checkDate.getDate() - days)).toISOString();
  checkDate = checkDate.toString().substring(0, checkDate.lastIndexOf('Z'));

  var dateField = "";
  if (type.includes("calls")) {
    dateField = "call_date_time";
  }
  if (type.includes("incidents")) {
    dateField = "date_occured";
  }

  url += "?$where=within_circle(location_1," + ll[1] + "," + ll[0] + "," + dist + encodeURIComponent(") and " + dateField + " > '") + encodeURIComponent(checkDate) + encodeURIComponent("'");

  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = data.length + " last " + days + " days";

      console.log(type + " " + data.length);

      d3.select("#" + type).html(msg);

    });
}

// TODO: update from 2009 to 2015. Something wrong with the 2015 API
function getFloodZone(url, ll) {
  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url
  }).intersects(LL).run(function(error, floodZones) {

    var msg = "";

    checkFeaturesForFloodZone(floodZones.features, ll).then(
      function(data) {
        console.log(data);
        msg += data;
        d3.select("#flood").html(msg);
      },
      function(err) {
        console.log(err);
        d3.select("#flood").html(err.message);
      }
    );

    d3.select("#flood").html("Still searching. (This is taking a bit longer than usual.)");


  });
}

function getNearbyNeighborhoods(url, ll, d) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var items = getItemsForFeatures(data.features, ll, d);

      var msg = "";
      $(items).each(function(i) {
        var item = $(this);
        if (item[0].properties.NAME) {
          msg += item[0].properties.NAME;
        } else if (item[0].properties.name) {
          msg += item[0].properties.name;
        } else {
          msg += "Could not locate name field."
        }

        if (i < items.length - 1) {
          msg += ", ";
        }
      });

      d3.select("#nearby-neighborhoods").html(msg);

    });
}

function getParks(url, ll, dist) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var items = getItemsForFeatures(data.features, ll, dist);

      var msg = items.length;

      d3.select("#parks").html(msg);

    });
}

function getSchools(url, ll, dist, type) {
  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      var msg = "<p class='preamble'>" + type + "</p>";

      var items = getItemsForFeatures(data.features, ll, dist);

      msg += items.length;

      d3.select("#" + type).html(msg);

    });
}

function getAverageTime(data) {
  var msg = "";
  var avg = 0;
  $(data).each(function() {
    var d = $(this);
    if (d && d[0]) {
      d = d[0];
      var callTime = 0;
      var onSceneTime = 0;
      if (d.call_date_and_time) {
        callTime = new Date(d.call_date_and_time);
        onSceneTime = new Date(d.on_scene_date_and_time);
      } else {
        callTime = new Date(d.call_date_time);
        onSceneTime = new Date(d.on_scene_date_time);
      }

      var duration = onSceneTime.getTime() - callTime.getTime();
      if (!isNaN(duration) && duration > 0) {
        avg += duration;
      }
    }
  });

  avg = (avg / data.length) / 1000 / 60;
  avg = avg.toFixed(2);

  msg += avg + " minutes";

  return msg;
}

function getClosestItem(features, ll) {
  var msg = "";
  var closest = {
    item: null,
    distance: 9999
  };
  $(features).each(function() {
    var f = $(this);
    //console.log(f[0]);
    if (f && f[0]) {
      var dist = d3.geoDistance(f[0].geometry.coordinates, ll);
      if (dist < closest.distance) {
        closest.distance = dist;
        closest.item = f;
      }
    }
  });
  closest.distance = parseFloat(closest.distance) * 3959;
  closest.distance = closest.distance.toFixed(2);

  return closest;
}

function getItemsForFeatures(features, ll, d) {
  var msg = "";
  var items = $(features).filter(function() {
    var f = $(this);
    //console.log(f[0]);
    if (f && f[0]) {
      var dist = d3.geoDistance(f[0].geometry.coordinates, ll);
      var max = d / 3959;
      if (dist < max) {
        return f[0];
      }
    }
  });

  // Filter only duplicates when .NAME property is the same, example neighborhoods are duplicated by diff lat/lon
  var flags = {};
  items = items.filter(function() {
    var item = $(this);
    //console.log(item);
    if (flags[item[0].properties.NAME]) {
      return false;
    }
    flags[item[0].properties.NAME] = true;
    return true;
  });

  return items;
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

  msg += lvl;


  switch (lvl) {
    case 0:
      {
        d3.select(".aicuz").classed("_0", true);
      }
    case 50:
      {
        d3.select(".aicuz").classed("_50", true);
      }
      break;
    case 55:
      {
        d3.select(".aicuz").classed("_55", true);
      }
      break;
    case 60:
      {
        d3.select(".aicuz").classed("_60", true);
      }
      break;
    case 65:
      {
        d3.select(".aicuz").classed("_65", true);
      }
      break;
    case 70:
      {
        d3.select(".aicuz").classed("_70", true);
      }
      break;
    case 75:
      {
        d3.select(".aicuz").classed("_75", true);
      }
      break;
    case 80:
      {
        d3.select(".aicuz").classed("_80", true);
      }
      break;
    case 85:
      {
        d3.select(".aicuz").classed("_85", true);
      }
      break;
  }

  return msg;
}

function checkFeaturesForFloodZone(features, ll) {

  var deferred = D();

  var msg = "";

  $(features).each(function(i) {
    var f = $(this);
    if (f && f[0]) {
      if (d3.geoContains(f[0], ll)) {
        var fz = f[0].properties.FLD_ZONE;
        msg = fz;
        console.log("Flood Zone: " + fz);
        switch (fz) {
          case "X":
            {
              msg += " Insurance is NOT REQUIRED";
            }
            break;
          case "A":
          case "AE":
          case "AH":
          case "AO":
          case "AR":
            {
              msg += " Insurance IS REQUIRED";
            }
            break;
          default:
            {
              if (fz.indexOf("0.2") !== -1) {
                msg += " Insurance is NOT REQUIRED"
              } else {
                msg += " Your flood zone could not be determined";
              }
            }
            break;
        }

        deferred.resolve(msg);
      } else if (i == features.length - 1) {
        deferred.resolve(msg);
      }
    }
  });

  return deferred.promise;
}

$(document).ready(function() {
  config = $("#config").val();
  config = JSON.parse(config);
  //console.log(config);
  searchPosition = $("#searchPosition").val();
  //console.log(searchPosition);
  searchPosition = searchPosition.split(',');
  getFeaturesForLocation(searchPosition);
  $(document).tooltip();
})
