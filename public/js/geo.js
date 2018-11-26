var locations = {};
var DataDirectory = {};
var searchPosition = [];

var neighborhoodStr = "Unknown";
var cityStr = "Unknown";
var stateStr = "Unknown";
var fedStr = "Unknown";

var geoCoderKey = "";
var GApisKey = "";

function getAddress(searchPosition) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    var method = "GET";
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      searchPosition + "&key=" + geoCoderKey;
    var async = true;

    request.open(method, url, async);
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status == 200) {
          var data = JSON.parse(request.responseText);
          //console.log(data);
          var address = data.results[0];
          resolve(address);
        } else {
          reject(request.status);
        }
      }
    };
    request.send();
  });
}
//Needs work for error handling unmatched cities or states
function loadDataDirectory(address) {
  parseAddress(address);
  console.log("The city to search is: " + cityStr);
  console.log("The state is: " + stateStr);
  //remove whitespace
  cityPath = cityStr.replace(/\s+/g, '');
  statePath = stateStr.replace(/\s+/g, '');
  console.log(cityPath);
  //create object path to dynamically insert city into function parameters
  if (locations[statePath]) {
    DataDirectory = cityPath.split('.').reduce((o, i) => o[i], locations[statePath]);
  }

}

function getFeaturesForLocation(address, position) {
  var ll = null;

  // LON LAT unless locally manipulated b/c D3 is LON LAT
  if (position.coords) {
    ll = [position.coords.longitude, position.coords.latitude];
  } else {
    ll = [position[1], position[0]];
  }

  // TODO: Don't need to check the city again if form was used

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.

  getRepresentation(locations.UnitedStates.representatives, address.formatted_address);

  if (DataDirectory && DataDirectory.boundary) {
    var statePath = stateStr.replace(/\s+/g, '');

    L.esri.query({
      url: DataDirectory.boundary
    }).intersects(LL).run(function (error, data) {
      getAICUZ(DataDirectory.property.AICUZ, ll);
      getEvacuationZone(locations[statePath].evacuation, ll);
      getPolicePatrolZone(DataDirectory.police.zones, ll);
      getSchools(DataDirectory.schools, ll, 3);
      getParks(DataDirectory.recreation.parks, ll, 1);
      getClosestThing(DataDirectory.recreation.parks, ll, "park");
      getClosestThing(DataDirectory.recreation.libraries, ll, "library");
      // getClosestThing(DataDirectory.fire.hydrants.public, ll, "hydrant-public", "feet");
      // getClosestThing(DataDirectory.fire.hydrants.private, ll, "hydrant-private", "feet");
      getClosestThing(DataDirectory.recreation.centers, ll, "recCenter");
      getNearbyNeighborhoods(DataDirectory.neighborhoods, ll, 1, "neighborhoods")
      getAverageResponseTime(DataDirectory.medical.emergency.calls, ll, .25, "ems");
      getAverageResponseTime(DataDirectory.police.calls, ll, .25, "police");
      getPoliceIncidents(DataDirectory.police.incidents, ll, .5, 30);
      //getCountWithinDays(DataDirectory.police.calls, ll, 1, 30, "police-calls");
      getFloodZone(DataDirectory.property.FIRM, ll);
      getPropertySales(DataDirectory.property.sales, address);
    });
  }


}

function getAICUZ(url, ll) {

  if (!url || url == "") {
    d3.select("#aicuz").html("Needs data source");
    return;
  }

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url
  }).intersects(LL).run(function (error, data) {
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
    .response(function (xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function (data) {

      var msg = getAverageTime(data, ll);
      //var z = "<p>" + data.length + "</p>";

      msg += "<a title='1/4 mile search. Average response time based on " + data.length + " records.' href=''>*</a>";

      d3.select("#" + type + "-response-avg").html(msg);

    });


}

function getClosestThing(url, ll, thing, units) {
  if (!url || url == "") {
    d3.select("#closest-" + thing).html("Needs data source");
    return;
  }

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url
  }).run(function (error, data) {
    if (!data || !data.features) {
      d3.select("#closest-" + thing).html("No data returned");
      return;
    }

    var closest = getClosestItem(data.features, ll);

    //console.log(closest.item[0].properties);

    var msg = "";

    if (!closest.item || parseInt(closest.distance) === 9999) {
      msg = "None";
    } else {
      console.log(thing + ": " + closest.distance);

      switch (units) {
        case "feet":
          {
            console.log(closest.distance);
            msg = parseInt(closest.distance * 5280) + " feet";
          }
          break;
        default:
          {
            msg = closest.distance + " miles";
          }
      }
    }

    var html = "";
    if (closest.item[0].properties.LATI) {
      var mapUrl = "https://maps.google.com/?ll=" + closest.item[0].properties.LATI + "," + closest.item[0].properties.LONG_

      var html = "<a href='" + mapUrl + "'>" + msg + "</a>"

    } else {
      html = msg;
    }


    d3.select("#closest-" + thing).html(html);

  });

}

function getCountWithinDays(url, ll, dist, days, type) {

  var deferred = D();

  if (!url || url == "") {
    d3.select("#" + type).html("Needs data source");
    return;
  }

  dist = dist * 1609.35; // 1609.35 is 1 mile in meters

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
    .response(function (xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function (error, data) {
      var count = "";
      if (error) {
        console.error("Getting count within days");
        console.error(error);
        deferred.resolve(null);
      } else {
        count = data.length + " " + type + " in the past " + days + " days";

        d3.select("#" + type).html(count);
        deferred.resolve(data);
      }

    });

  return deferred.promise
}

function getEvacuationZone(url, ll) {
  if (!url || url == "") {
    d3.select("#evacuation").html("Needs data source");
    return;
  }

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url
  }).intersects(LL).run(function (error, data) {

    if (error) {
      console.log(error);
      return;
    }

    if (data && data.features && data.features[0]) {
      var evacZone = data.features[0].properties.Zone ? data.features[0].properties.Zone : "UNKNOWN";
      d3.select('#modal-body').html(evacZone);
      //$('#notice').modal('show'); // uncomment during evac order
      d3.select("#evacuation").html(evacZone);
    } else {
      d3.select("#evacuation").html("No Features in Evacuation data set");
    }

  });
}

function getPolicePatrolZone(url, ll) {
  if (!url || url == "") {
    d3.select("#police-patrol").html("Needs data source");
    return;
  }

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url
  }).intersects(LL).run(function (error, data) {

    if (error) {
      console.log(error);
      return;
    }

    if (data && data.features && data.features[0]) {
      var patrolZone = data.features[0].properties.BEAT ? data.features[0].properties.BEAT : "UNKNOWN";
      d3.select("#police-patrol").html(patrolZone); //+ "<a href=''>Zone Map</a>");
    } else {
      d3.select("#police-patrol").html("No Features in Patrol Zone data set");
    }

  });
}

// TODO: update from 2009 to 2015. Something wrong with the 2015 API
async function getFloodZone(url, ll) {
  console.log("Flood Url: " + url);
  var promise = new Promise(function (resolve, reject) {
    if (!url || url == "") {
      d3.select("#flood").html("Needs data source");
      resolve;
      return;
    }

    var LL = L.latLng(ll[1], ll[0]);
    // use location to find out which census block they are inside.
    L.esri.query({
      url: url
    }).intersects(LL).run(function (error, data) {

      var msg = "";

      if (error) {
        console.log(error);
        resolve;
      }

      if (data) {

        checkFeaturesForFloodZone(data.features, ll).then(
          function (data) {
            msg += data;
            d3.select("#flood").html(msg);
            resolve;
          },
          function (err) {
            console.log(err);
            d3.select("#flood").html(err.message);
            resolve;
          }
        );
      }

      d3.select("#flood").html("Still searching. (This is taking a bit longer than usual.)");


    });
  });

  return promise;
}

function getNearbyNeighborhoods(url, ll, d) {
  console.log("Neighborhoods:" + url);
  if (!url || url == "") {
    d3.select("#nearby-neighborhoods").html("Needs data source");
    return;
  }

  if (url.indexOf(".geojson") > -1) {
    d3.request(url)
      .mimeType("application/json")
      .response(function (xhr) {
        return JSON.parse(xhr.responseText);
      })
      .get(function (data) {
        neighborhoodHelper(data, ll, d);
      });

  } else {
    var LL = L.latLng(ll[1], ll[0]);
    // use location to find out which census block they are inside.
    L.esri.query({
      url: url
    }).run(function (error, data) {
      if (error) {
        console.error(error);
      } else {
        neighborhoodHelper(data, ll, d);
      }
    });
  }
}

function getPropertySales(url, address) {
  var deferred = D();

  if (!url || url == "") {
    d3.select("#property-sales").html("Needs data source");
    deferred.resolve(null);
    return;
  }

  var street_name = address.formatted_address.split(",")[0];
  console.log("Street address is: " + street_name);

  url += "?$where=street_address=" + encodeURIComponent("'") + street_name + encodeURIComponent("'");

  d3.request(url)
    .mimeType("application/json")
    .response(function (xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function (error, data) {
      if (error) {
        console.error("Getting Property Sales");
        console.error(error);
        deferred.resolve(null);
      } else {
        var html = "";

        if (data.length > 0) {
          var last_record = data.length - 1;

          var dataLast = data[last_record];

          var land_value = dataLast.land_value;
          var improvement_value = dataLast.improvement_value;
          var total_value = dataLast.total_value;
          var sale_date = dataLast.sale_date;

          html += "<p> Last Sale: " + moment(sale_date).format('MM/DD/YYYY') + "</p>";
          html += "<p>Land Value: $" + land_value + "</p>";
          html += "<p>Improvement Value: $" + improvement_value + "</p>";
          html += "<p>Total Value: $" + total_value + "</p>";
        } else {
          html += "<p>No property sales data was found</p>";
        }



        d3.select("#property-sales").html(html);
        deferred.resolve(data);
      }

    });

  return deferred.promise
}

function getParks(url, ll, dist) {
  if (!url || url == "") {
    d3.select("#parks").html("Needs data source");
    return;
  }

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url
  }).run(function (error, data) {
    if (!data || !data.features) {
      d3.select("#parks").html("No data returned!");
      return;
    }

    var items = getItemsForFeatures(data.features, ll, dist);

    var msg = items.length;

    d3.select("#parks").html(msg);
  });
}

function getPoliceIncidents(incidents, ll, dist, days) {
  if (!incidents) return;

  getCountWithinDays(incidents, ll, dist, days, "police-incidents").then(function (incidents) {
    if (incidents) {
      // console.log("Police Incidents")
      // console.log(incidents);
      var html = "<table style='width:100%;'>";
      incidents = incidents.reverse(); // reverse the sort order
      $(incidents).each(function (index, incident) {
        var statusStyle = "unfounded";
        switch (incident.case_status) {
          case "ACTIVE - PENDING":
          case "ACTIVE PENDING WARRANT OBTAINED":
            {
              statusStyle = "active";
            }
            break;
          case "INACTIVE - PENDING":
            {
              statusStyle = "inactive";
            }
            break;
          case "EXCEPTIONALLY CLEARED":
          case "CLEARED BY ARREST":
            {
              statusStyle = "cleared";
            }
            break;
          case "UNFOUNDED, NO FURTHER ACTION NEEDED":
          case "OTHER":
            {
              statusStyle = "unfounded";
            }
            break;
        };
        html += "<tr class='" + statusStyle + "' style='font-size:22px;'>";
        html += "<td>" + moment(incident.date_occured).format("MM-DD-YYYY") + "</td>";
        html += "<td>" + incident.offense_description + "</td>";
        html += "<td>" + incident.location_1_address + "</td>";
        html += "<td>" + incident.case_status + "</td>"
        html += "</tr>";
      })
      html += "</table>"
      $("#police-incidents-list").html(html);
    } else {
      console.log("No Data from getCountWithinDays")
    }
  });
}

function getRepresentation(url, address) {
  if (!url || url == "") {
    d3.select("#representation").html("Needs data source");
    return;
  }

  url = url + "?address=" + address + "&key=" + GApisKey;

  d3.request(url)
    .mimeType("application/json")
    .header("X-Requested-With", "XMLHttpRequest")
    .response(function (xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function (error, data) {
      var msg = "";

      if (error) {
        msg = "There was an error retreiving representatives"
        console.error(error);
      } else {
        var divisions = data.divisions;
        //divisions = Object.values(divisions);
        var officials = data.officials;
        var offices = data.offices;

        $(offices).each(function (index, office) {
          //console.log(office);
          msg += "<p style='background-color:LightBlue'>" + office.name + "</p>";


          $(office.officialIndices).each(function (index, officialIndex) {
            var official = officials[officialIndex];
            msg += "<p>" + official.name + "</p>";
          });
        })
      }

      d3.select("#representatives").html(msg);
    })
}

function getSchools(config, ll, dist) {
  if (!config || config == "") {
    d3.select("#schools").html("Needs data source");
    return;
  }

  // handle local variations, location and zone data

  getNearbySchools(config.locations, ll, dist);
  getZonedSchools(config.zones, ll);

}

function getNearbySchools(config, ll, dist) {

  if (!config || (config.all === "" && config.elementary === "" && config.middle === "" && config.high === "")) return;

  var levels = Object.keys(config);

  $(levels).each(function (i) {
    var type = this;
    var url = config[type];

    if (url !== "") {

      var LL = L.latLng(ll[1], ll[0]);
      // use location to find out which census block they are inside.
      L.esri.query({
        url: url
      }).run(function (error, data) {
        var items = getItemsForFeatures(data.features, ll, dist);

        var msg = "<p style='text-decoration:underline;'>" + items.length + " within " + dist + " miles</p><p>";
        switch (type.toString()) {
          case "elementary":
            {
              typeStr = " Elementary School";
            }
            break;
          case "middle":
            {
              typeStr = " Middle School";
            }
            break;
          case "high":
            {
              typeStr = " High School";
            }
            break;
          default:
            {
              typeStr = "";
            }
        }
        $(items).each(function (i) {
          var item = $(this);
          var len = 0;
          if (item[0].properties.NAME) {
            len = item[0].properties.NAME.indexOf(typeStr) > 0 ? item[0].properties.NAME.indexOf(typeStr) : item[0].properties.NAME.length;
            msg += item[0].properties.NAME.substring(0, len);
          } else if (item[0].properties.Name) {
            len = item[0].properties.Name.indexOf(typeStr) > 0 ? item[0].properties.Name.indexOf(typeStr) : item[0].properties.Name.length;
            msg += item[0].properties.Name.substring(0, len);
          } else if (item[0].properties.name) {
            len = item[0].properties.name.indexOf(typeStr) > 0 ? item[0].properties.name.indexOf(typeStr) : item[0].properties.name.length;
            msg += item[0].properties.name.substring(0, len);
          } else {
            msg += "Could not locate name field."
          }

          if (i < items.length - 1) {
            msg += ", ";
          }
        });
        msg += "</p>";



        d3.select("#school-location-" + type).html(msg);
      });
    }

  });

}

function getZonedSchools(config, ll) {
  if (!config || (config.all === "" && config.elementary === "" && config.middle === "" && config.high === "")) return;

  var levels = Object.keys(config);

  $(levels).each(function (i) {
    var type = this;
    var url = config[type];

    type = type.toString();

    if (url !== "") {
      var LL = L.latLng(ll[1], ll[0]);
      // use location to find out which census block they are inside.
      L.esri.query({
        url: url
      }).run(function (error, data) {
        var msg = "";
        switch (type) {
          case "elementary":
            {
              typeStr = " Elementary School";
            }
            break;
          case "middle":
            {
              typeStr = " Middle School";
            }
            break;
          case "high":
            {
              typeStr = " High School";
            }
            break;
          default:
            {
              typeStr = "";
            }
        }
        $(data.features).each(function () {
          var f = $(this);
          if (f && f[0]) {
            if (d3.geoContains(f[0], ll)) {
              var len = 0;
              if (f[0].properties.ES_NAME) {
                len = f[0].properties.ES_NAME.indexOf(typeStr) > 0 ? f[0].properties.ES_NAME.indexOf(typeStr) : f[0].properties.ES_NAME.length;
                msg += f[0].properties.ES_NAME.substring(0, len);
              } else if (f[0].properties.ELEM_NAME) {
                len = f[0].properties.ELEM_NAME.indexOf(typeStr) > 0 ? f[0].properties.ELEM_NAME.indexOf(typeStr) : f[0].properties.ELEM_NAME.length;
                msg += f[0].properties.ELEM_NAME.substring(0, len);
              } else if (f[0].properties.MS_NAME) {
                len = f[0].properties.MS_NAME.indexOf(typeStr) > 0 ? f[0].properties.MS_NAME.indexOf(typeStr) : f[0].properties.MS_NAME.length;
                msg += f[0].properties.MS_NAME.substring(0, len);
              } else if (f[0].properties.HS_NAME) {
                len = f[0].properties.HS_NAME.indexOf(typeStr) > 0 ? f[0].properties.HS_NAME.indexOf(typeStr) : f[0].properties.HS_NAME.length;
                msg += f[0].properties.HS_NAME.substring(0, len);
              }

            }
          }
        });

        msg += "</p>";

        // if (type == "all") {
        //     $("#all").parent().parent().next().hide();
        //     $("#all").parent().parent().next().next().hide();
        //     $("#all").parent().parent().next().next().next().hide();
        // } else {
        //   $("#all").parent().parent().hide();
        // }

        d3.select("#school-zone-" + type).html(msg);
      });

    }

  });
}

function getAverageTime(data) {
  var msg = "";
  var avg = 0;
  $(data).each(function () {
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
      //console.log(duration);
      if (!isNaN(duration) && duration > 0 && duration < 999999) { // throw out unreasonable numbers
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
  $(features).each(function () {
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
      var dist = d3.geoDistance(coords, ll); // distance in radians
      if (dist < closest.distance) {
        //console.log(dist);
        closest.distance = dist;
        closest.item = f;
      }
    }
  });
  closest.distance = closest.distance != 9999 ? parseFloat(closest.distance) * 3959 : 9999; // 3959 is Earth radius in miles
  closest.distance = closest.distance.toFixed(2);

  //console.log(closest.distance)

  return closest;
}

function getItemsForFeatures(features, ll, d) {
  var msg = "";

  var items = $(features).filter(function () {
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
  items = items.filter(function () {
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
    } else if (item[0].properties.PARK_NAME) {
      if (flags[item[0].properties.PARK_NAME]) {
        return false;
      }
      flags[item[0].properties.PARK_NAME] = true;
      return true;
    } else if (item[0].properties.NBRHD_NAME) {
      if (flags[item[0].properties.NBRHD_NAME]) {
        return false;
      }
      flags[item[0].properties.NBRHD_NAME] = true;
      return true;
    } else if (item[0].properties.ES_NAME) {
      if (flags[item[0].properties.ES_NAME]) {
        return false;
      }
      flags[item[0].properties.ES_NAME] = true;
      return true;
    } else if (item[0].properties.MS_NAME) {
      if (flags[item[0].properties.MS_NAME]) {
        return false;
      }
      flags[item[0].properties.MS_NAME] = true;
      return true;
    } else if (item[0].properties.HS_NAME) {
      if (flags[item[0].properties.HS_NAME]) {
        return false;
      }
      flags[item[0].properties.HS_NAME] = true;
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
  $(features).each(function () {
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

  //console.log(features.length)

  $(features).each(function (i) {
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
          case "VE":
            {
              msg += " Insurance IS REQUIRED";
            }
            break;
          default:
            {
              if (fz && fz.indexOf("0.2") !== -1) {
                msg += " Insurance requirement is UNKNOWN"
              } else {
                msg = "Your flood zone could not be determined";
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

function neighborhoodHelper(data, ll, d) {
  var items = getItemsForFeatures(data.features, ll, d);

  var msg = "";
  $(items).each(function (i) {
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
}

function parseAddress(address) {
  var address = address.address_components;
  $(address).each(function (index, component) {
    switch (component.types[0]) {
      case "neighborhood":
        {
          neighborHoodStr = component.long_name;
          d3.select("#neighborhood").html(neighborHoodStr);
        }
        break;
      case "locality":
        {
          cityStr = component.long_name;
          d3.select("#city").html(cityStr);
        }
        break;
      case "administrative_area_level_1":
        {
          stateStr = component.long_name;
        }
        break;
      default:
        {
          // not parsing the others RN
        }
        break;
    }
  })
}

async function start() {
  await getAddress(searchPosition)
    .then(function (address) {
      var addr = address;
      loadDataDirectory(address);
      getFeaturesForLocation(addr, searchPosition);
    })
    .catch(function (err) {
      console.error(err);
    });
}

$(document).ready(function () {
  locations = $("#locations").val();
  locations = JSON.parse(locations);
  geoCoderKey = $("#geoCoderKey").val();
  GApisKey = $("#GApisKey").val();
  //console.log(locations);
  searchPosition = $("#searchPosition").val();
  //console.log(searchPosition);
  searchPosition = searchPosition.split(',');
  start();
  $(document).tooltip();
})