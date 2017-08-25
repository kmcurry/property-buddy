var locations = {};
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
  // TODO: Stop brute-force checking every city
  d3.json(locations.Virginia.Norfolk.boundary, function(error, mapData) {
    console.log("Checking in NFK");
    var features = mapData.features[0];
    if (d3.geoContains(features, ll)) {
      console.log("Location is NFK");
      var msg = "<p class='p-sm'>You are in Norfolk</p>";
      d3.select("#location").html(msg);
      getAICUZ(locations.Virginia.Norfolk.AICUZ, ll);
      getFloodZone(locations.Virginia.Norfolk.FIRM, ll);
      // getSchools(locations.Virginia.Norfolk.schools.elementary, ll, 3, "Elementary");
      // getSchools(locations.Virginia.Norfolk.schools.middle, ll, 3, "Middle");
      // getSchools(locations.Virginia.Norfolk.schools.high, ll, 3, "High");
      getParks(locations.Virginia.Norfolk.parks, ll, 1);
      getClosestThing(locations.Virginia.Norfolk.parks, ll, "park");
      getClosestThing(locations.Virginia.Norfolk.libraries, ll, "library");
      getClosestThing(locations.Virginia.Norfolk.hydrants, ll, "hydrant", "feet");
      getClosestThing(locations.Virginia.Norfolk.recCenters, ll, "recCenter");
      getNearbyNeighborhoods(locations.Virginia.Norfolk.neighborhoods, ll, 1, "neighborhoods")
      getAverageResponseTime(locations.Virginia.Norfolk.emergency.calls, ll, .25, "ems");
      getAverageResponseTime(locations.Virginia.Norfolk.police.calls, ll, .25, "police");
      getCountWithinDays(locations.Virginia.Norfolk.police.incidents, ll, 1, 30, "police-incidents");
      getCountWithinDays(locations.Virginia.Norfolk.police.calls, ll, 1, 30, "police-calls");
    } else {
      console.log("Location is not in NFK")
    }
  });

  d3.json(locations.Virginia.VirginiaBeach.boundary, function(error, mapData) {
    console.log("Checking in VB");
    var features = mapData.features[0];
    if (d3.geoContains(features, ll)) {
      console.log("Location is VB");
      var msg = "Virginia Beach";
      d3.select("#city").html(msg);
      getAICUZ(locations.Virginia.VirginiaBeach.AICUZ, ll);
      getFloodZone(locations.Virginia.VirginiaBeach.FIRM, ll);
      // getSchools(locations.Virginia.VirginiaBeach.schools.elementary, ll, 3, "Elementary");
      // getSchools(locations.Virginia.VirginiaBeach.schools.middle, ll, 3, "Middle");
      // getSchools(locations.Virginia.VirginiaBeach.schools.high, ll, 3, "High");
      getParks(locations.Virginia.VirginiaBeach.parks, ll, 1);
      getClosestThing(locations.Virginia.VirginiaBeach.parks, ll, "park");
      getClosestThing(locations.Virginia.VirginiaBeach.libraries, ll, "library");
      getClosestThing(locations.Virginia.VirginiaBeach.hydrants, ll, "hydrant", "feet");
      getClosestThing(locations.Virginia.VirginiaBeach.recCenters, ll, "recCenter");
      getNearbyNeighborhoods(locations.Virginia.VirginiaBeach.neighborhoods, ll, 1, "neighborhoods")
      getAverageResponseTime(locations.Virginia.VirginiaBeach.emergency.calls, ll, .25, "ems");
      getAverageResponseTime(locations.Virginia.VirginiaBeach.police.calls, ll, .25, "police");
      getCountWithinDays(locations.Virginia.VirginiaBeach.police.incidents, ll, 1, 30, "police-incidents");
      getCountWithinDays(locations.Virginia.VirginiaBeach.police.calls, ll, 1, 30, "police-calls");

    } else {
      console.log("Location is not in VB")
    }
  });

  d3.json(locations.Virginia.Chesapeake.boundary, function(error, mapData) {
    console.log("Checking in Chesapeake");
    var features = mapData.features[0];
    if (d3.geoContains(features, ll)) {
      console.log("Location is Chesapeake");
      var msg = "Chesapeake";
      d3.select("#city").html(msg);
      getAICUZ(locations.Virginia.Chesapeake.AICUZ, ll);
      getFloodZone(locations.Virginia.Chesapeake.FIRM, ll);
      // getSchools(locations.Virginia.Chesapeake.schools.elementary, ll, 3, "Elementary");
      // getSchools(locations.Virginia.Chesapeake.schools.middle, ll, 3, "Middle");
      // getSchools(locations.Virginia.Chesapeake.schools.high, ll, 3, "High");
      getParks(locations.Virginia.Chesapeake.parks, ll, 1);
      getClosestThing(locations.Virginia.Chesapeake.parks, ll, "park");
      getClosestThing(locations.Virginia.Chesapeake.libraries, ll, "library");
      getClosestThing(locations.Virginia.Chesapeake.hydrants, ll, "hydrant", "feet");
      getClosestThing(locations.Virginia.Chesapeake.recCenters, ll, "recCenter");
      getNearbyNeighborhoods(locations.Virginia.Chesapeake.neighborhoods, ll, 1, "neighborhoods")
      getAverageResponseTime(locations.Virginia.Chesapeake.emergency.calls, ll, .25, "ems");
      getAverageResponseTime(locations.Virginia.Chesapeake.police.calls, ll, .25, "police");
      getCountWithinDays(locations.Virginia.Chesapeake.police.incidents, ll, 1, 30, "police-incidents");
      getCountWithinDays(locations.Virginia.Chesapeake.police.calls, ll, 1, 30, "police-calls");
    } else {
      console.log("Location is not in Chesapeake");
    }
  });

  d3.json(locations.Virginia.FallsChurch.boundary, function(error, mapData) {
    console.log("Checking in Falls Church");
    var features = mapData.features[0];
    if (d3.geoContains(features, ll)) {
      console.log("Location is Falls Church");
      var msg = "Falls Church";
      d3.select("#city").html(msg);
      getAICUZ(locations.Virginia.FallsChurch.AICUZ, ll);
      getFloodZone(locations.Virginia.FallsChurch.FIRM, ll);
      // getSchools(locations.Virginia.FallsChurch.schools.elementary, ll, 3, "Elementary");
      // getSchools(locations.Virginia.FallsChurch.schools.middle, ll, 3, "Middle");
      // getSchools(locations.Virginia.FallsChurch.schools.high, ll, 3, "High");
      getParks(locations.Virginia.FallsChurch.parks, ll, 1);
      getClosestThing(locations.Virginia.FallsChurch.parks, ll, "park");
      getClosestThing(locations.Virginia.FallsChurch.libraries, ll, "library");
      getClosestThing(locations.Virginia.FallsChurch.hydrants, ll, "hydrant", "feet");
      getClosestThing(locations.Virginia.FallsChurch.recCenters, ll, "recCenter");
      getNearbyNeighborhoods(locations.Virginia.FallsChurch.neighborhoods, ll, 1, "neighborhoods")
      getAverageResponseTime(locations.Virginia.FallsChurch.emergency.calls, ll, .25, "ems");
      getAverageResponseTime(locations.Virginia.FallsChurch.police.calls, ll, .25, "police");
      getCountWithinDays(locations.Virginia.FallsChurch.police.incidents, ll, 1, 30, "police-incidents");
      getCountWithinDays(locations.Virginia.FallsChurch.police.calls, ll, 1, 30, "police-calls");
    } else {
      console.log("Location is not in Chesapeake");
    }
  });

}

function getAICUZ(url, ll) {

  if (!url || url == "") {
    d3.select("#aicuz").html("Needs data source");
    return;
  }

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

  if (!url || url == "") {
    d3.select("#" + type + "-response-avg").html("Needs data source");
    return;
  }

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
  if (!url || url == "") {
    d3.select("#closest-" + thing).html("Needs data source");
    return;
  }

  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      if (!data || !data.features) {
        d3.select("#closest-" + thing).html("No data returned");
        return;
      }

      var closest = getClosestItem(data.features, ll);

      var msg = "";

      if (!closest.item || parseInt(closest.distance) === 9999) {
        msg = "None";
      } else {
        switch (units) {
          case "feet": {
            msg = parseInt(closest.distance * 5280) + " feet";
          }
          break;
          default: {
            msg = closest.distance + " miles";
          }
        }
      }

      d3.select("#closest-" + thing).html(msg);

    });
}

function getCountWithinDays(url, ll, dist, days, type) {
  if (!url || url == "") {
    d3.select("#" + type).html("Needs data source");
    return;
  }

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

  if (!url || url == "") {
    d3.select("#flood").html("Needs data source");
    return;
  }

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
  if (!url || url == "") {
    d3.select("#nearby-neighborhoods").html("Needs data source");
    return;
  }

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
        } else if (item[0].properties.Name) {
          msg += item[0].properties.Name;
        } else if (item[0].properties.name) {
          msg += item[0].properties.name;
        } else if (item[0].properties.NBRHD_NAME) {
          msg += item[0].properties.NBRHD_NAME;
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
  if (!url || url == "") {
    d3.select("#parks").html("Needs data source");
    return;
  }

  d3.request(url)
    .mimeType("application/json")
    .response(function(xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function(data) {

      if (!data || !data.features) {
        d3.select("#parks").html("No data returned!");
        return;
      }

      var items = getItemsForFeatures(data.features, ll, dist);

      var msg = items.length;

      d3.select("#parks").html(msg);

    });
}

function getSchools(url, ll, dist, type) {
  if (!url || url == "") {
    d3.select("#" + type).html("Needs data source");
    return;
  }

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
      var coords = null;
      if (f[0].geometry.coordinates[0].length) {
        if (f[0].geometry.coordinates[0][0].length) {
          coords = f[0].geometry.coordinates[0][0][0];
        } else {
          coords = f[0].geometry.coordinates[0][0];
        }
      } else {
        coords = f[0].geometry.coordinates;
      }
      var dist = d3.geoDistance(coords, ll);
      if (dist < closest.distance) {
        closest.distance = dist;
        closest.item = f;
      }
    }
  });
  closest.distance = closest.distance != 9999 ? parseFloat(closest.distance) * 3959 : 9999;
  closest.distance = closest.distance.toFixed(2);

  return closest;
}

function getItemsForFeatures(features, ll, d) {
  var msg = "";

  var items = $(features).filter(function() {
    var f = $(this);
    if (f && f[0]) {
      var coords = null;
      if (f[0].geometry.coordinates[0].length) {
        if (f[0].geometry.coordinates[0][0].length) {
          coords = f[0].geometry.coordinates[0][0][0];
        } else {
          coords = f[0].geometry.coordinates[0][0];
        }
      } else {
        coords = f[0].geometry.coordinates;
      }
      var dist = d3.geoDistance(coords, ll);
      var max = d / 3959;
      if (dist <= max) {
        //console.log(f[0]);
        return f[0];
      }
    }
  });

  // Filter only duplicates when .NAME property is the same, example neighborhoods are duplicated by diff lat/lon
  // TODO: what about diff name fields?
  var flags = {};
  items = items.filter(function() {
    var item = $(this);
    if (item[0].properties.NAME) {
      if (flags[item[0].properties.NAME]) {
        return false;
      }
      flags[item[0].properties.NAME] = true;
      return true;
    } else if (item[0].properties.Name) {
      if (flags[item[0].properties.Name]) {
        return false;
      }
      flags[item[0].properties.Name] = true;
      return true;
    } else if (item[0].properties.name) {
      if (flags[item[0].properties.name]) {
        return false;
      }
      flags[item[0].properties.name] = true;
      return true;
    }  else if (item[0].properties.PARK_NAME) {
      if (flags[item[0].properties.PARK_NAME]) {
        return false;
      }
      flags[item[0].properties.PARK_NAME] = true;
      return true;
    }  else if (item[0].properties.NBRHD_NAME) {
      if (flags[item[0].properties.NBRHD_NAME]) {
        return false;
      }
      flags[item[0].properties.NBRHD_NAME] = true;
      return true;
    } else {
      return false;
    }

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
  locations = $("#locations").val();
  locations = JSON.parse(locations);
  //console.log(locations);
  searchPosition = $("#searchPosition").val();
  //console.log(searchPosition);
  searchPosition = searchPosition.split(',');
  getFeaturesForLocation(searchPosition);
  $(document).tooltip();
})
