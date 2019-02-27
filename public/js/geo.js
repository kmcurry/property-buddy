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
  //create object path to dynamically insert city into function parameters
  if (locations[statePath]) {
    DataDirectory = cityPath.split('.').reduce((o, i) => o[i], locations[statePath]);
  }

}

function getFeaturesForLocation(address, position) {

  console.log("GETTING FEATURES FOR LOCATION");

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
      url: DataDirectory.boundary,
      returnGeometry: false
    }).intersects(LL).run(function (error, data) {

      getSafetyData(DataDirectory, ll);

      getAICUZ(DataDirectory.property.AICUZ, ll);

      getSchools(DataDirectory.schools, ll, 3);
      getParks(DataDirectory.recreation.parks, ll, 1);
      getClosestThing(DataDirectory.transportation.bus_stops, ll, "bus-stop");
      getClosestThing(DataDirectory.recreation.parks, ll, "park");
      getClosestThing(DataDirectory.recreation.libraries, ll, "library");
      getClosestThing(DataDirectory.recreation.centers, ll, "recreation-center");
      getNearbyNeighborhoods(DataDirectory.neighborhoods, ll, 1, "neighborhoods")
      getCouncilDistrict(DataDirectory.council, ll);
      
      //getCountWithinDays(DataDirectory.police.calls, ll, 1, 30, "police-calls").then(function() {
      //   d3.select("#police-calls").html(count);
      // });
      getCountWithinDays(DataDirectory.property.code_enforcement, ll, 1, 30, "code-enforcement").then(function(enforcements) {
        d3.select("#code-enforcement").html(enforcements.length);
      });
      getPropertySales(DataDirectory.property.sales, address);
      getFloodZone(locations.UnitedStates.FIRM, ll)

    });

  }

  LL = null;

}

function getAICUZ(url, ll) {

  if (!url || url == "") {
    d3.select("#aicuz").html("Needs data source");
    return;
  }

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url,
    returnGeometry: false
  }).intersects(LL).run(function (error, data) {
    var msg = "";
    if (data) {
      msg = checkFeaturesForAICUZNoiseLevel(data.features, ll);
    } else {
      msg = "No data. Please refresh the page.";
    }

    d3.select("#aicuz").html(msg);
    LL = null;
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

      msg += "<a title='Call or Incident reports within 1 mile. Average response time based on " + data.length + " records.' href=''>*</a>";

      d3.select("#" + type + "-response-avg").html(msg);

      msg = null;
      url = null;
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
    url: url,
    returnGeometry: false
  }).run(function (error, data) {
    if (!data || !data.features) {
      d3.select("#closest-" + thing).html("No data returned");
      return;
    }

    var closest = getClosestItem(data.features, ll);

    console.log(closest.item[0].properties);

    // TODO: filter attributes that contain substring 'name'
    var name = closest.item[0].properties.stop_name ? closest.item[0].properties.stop_name : closest.item[0].properties.NAME;

    var msg = "";

    if (!closest.item || parseInt(closest.distance) === 9999) {
      msg = "None";
    } else {
      console.log(thing + ": " + closest.distance);

      switch (units) {
        case "feet":
          {
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
    var lat = null;
    var lon = null;
    var mapUrl = "https://maps.google.com/maps/?q=";

    mapUrl += closest.item[0].properties.ADDRESS;

    var html = "<a href='" + mapUrl + "'>" + msg + "</a><br/>" + name;


    d3.select("#closest-" + thing).html(html);

    LL = null;
    msg = null;
    mapUrl = null;
    html = null;
    closest = null;

  });

}

function getCouncilDistrict(url, ll) {

  if (!url || url == "") {
    d3.select("#council-district").html("Needs data source");
    return;
  }

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url,
    returnGeometry: false
  }).intersects(LL).run(function (error, data) {
    if (error) {
      console.log(error);
      return;
    }

    if (data && data.features && data.features[0]) {
      var councilDistrict = data.features[0].properties.NAME ? data.features[0].properties.NAME : "UNKNOWN";
      d3.select("#council-district").html(councilDistrict);
    } else {
      d3.select("#council-district").html("No Features in Council District data set");
    }
  });
}

function getCountWithinDays(url, ll, dist, days, type) {

  var deferred = D();

  if (!url || url == "") {
    d3.select("#" + type).html("Needs data source");
    deferred.resolve(null);
    return deferred.promise;
  }

  console.log("Getting count for: " + type);

  dist = dist * 1609.35; // 1609.35 is 1 mile in meters

  var checkDate = new Date();
  checkDate = new Date(checkDate.setDate(checkDate.getDate() - days)).toISOString();
  checkDate = checkDate.toString().substring(0, checkDate.lastIndexOf('Z'));

  // WARNING: HARD-CODED FIELD
  var dateField = "";
  var locField = "location_1";
  if (type.includes("calls")) {
    dateField = "call_date_time";
  } else if (type.includes("incidents")) {
    dateField = "date_occured";
  } else if (type.includes("crash")) {
    dateField = "accident_date";
  } else if (type.includes("sales")) {
    dateField = "sale_date";
  } 
  else {
    dateField = "open_date";
    locField = "location1";
  }

  url += "?$where=within_circle(" + locField + "," + ll[1] + "," + ll[0] + "," + dist + encodeURIComponent(") and " + dateField + " > '") + encodeURIComponent(checkDate) + encodeURIComponent("'");
  
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
        count = data.length + /*" " + type +*/ " in the past " + days + " days";

        checkDate = null;
        dateField = null;
        url = null;
        deferred.resolve(data);
      }

    });

  return deferred.promise
}

function getCountWithinRange(url, range, type) {

  var deferred = D();

  if (!url || url == "") {
    return;
  }

  var startDate = new Date(range[0]);
  var endDate = new Date(range[1]);

  startDate = moment(startDate).format('YYYY-MM-DD');
  endDate =  moment(endDate).format('YYYY-MM-DD');

  console.log(startDate);
  console.log(endDate);

  // startDate = startDate.toString().substring(0, startDate.lastIndexOf('Z'));
  // endDate = endDate.toString().substring(0, endDate.lastIndexOf('Z'));

  // WARNING: HARD-CODED FIELD
  var dateField = "";
  if (type.includes("calls")) {
    dateField = "call_date_time";
  } else if (type.includes("incidents")) {
    dateField = "date_occured";
  } else if (type.includes("crash")) {
    dateField = "accident_date";
  } else if (type.includes("sales")) {
    dateField = "sale_date";
  } 
  else {
    dateField = "open_date";
  }

  url += "?$where=" + dateField + " >= '" + startDate + "' AND " + dateField + " < '" + endDate + "'";

  console.log(url)
  
  d3.request(url)
    .mimeType("application/json")
    .response(function (xhr) {
      return JSON.parse(xhr.responseText);
    })
    .get(function (error, data) {
      var count = "";
      if (error) {
        console.error("Error getting count within range");
        console.error(error);
        deferred.resolve(null);
      } else {
        count = data.length + /*" " + type +*/ " in the range " + startDate + " - " + endDate;

        console.log(count);
        startDate = null;
        endDate = null;
        dateField = null;
        url = null;
        deferred.resolve(data);
      }

    });

  return deferred.promise
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
      url: url,
      returnGeometry: false
    }).run(function (error, data) {
      if (error) {
        console.error(error);
      } else {
        neighborhoodHelper(data, ll, d);
      }
      LL = null;
    });
  }
}

function getParks(url, ll, dist) {
  if (!url || url == "") {
    d3.select("#parks").html("Needs data source");
    return;
  }

  var LL = L.latLng(ll[1], ll[0]);
  // use location to find out which census block they are inside.
  L.esri.query({
    url: url,
    returnGeometry: false
  }).run(function (error, data) {
    if (!data || !data.features) {
      d3.select("#parks").html("No data returned!");
      return;
    }

    var items = getItemsForFeatures(data.features, ll, dist);

    var msg = items.length;
    LL = null;
    data = null;
    d3.select("#parks").html(msg);
  });
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

          // var land_value = dataLast.land_value;
          // var improvement_value = dataLast.improvement_value;
          // var total_value = dataLast.total_value;
          // var sale_date = dataLast.sale_date;
          // var sale_price = dataLast.sale_price;

          data = data.sort(function (a, b) {
            return new Date(b.sale_date) - new Date(a.sale_date);
          });


          $(data).each(function (index, transaction) {
            var value = "";
            if (transaction.sale_price > 0) {
              value = transaction.sale_price;
            } else {
              if (transaction.improvement_value > 0) {
                value = transaction.improvement_value + " improvement"
              } else {
                value = "";
              }
            }
            html += "<p>" + moment(transaction.sale_date).format('MM/DD/YYYY') + " $" + value + "</p>";
          });

          // html += "<p> Last Sale: " + moment(sale_date).format('MM/DD/YYYY') + "</p>";
          // html += "<p>Sale Price: $" + sale_price + "</p>";
          // html += "<p>Land Value: $" + land_value + "</p>";
          // html += "<p>Improvement Value: $" + improvement_value + "</p>";
          // html += "<p>Total Value: $" + total_value + "</p>";

        } else {
          html += "<p>No property sales data was found</p>";
        }

        d3.select("#property-sales").html(html);

        LL = null;
        data = null;

        deferred.resolve(data);
      }

    });

  return deferred.promise
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
          msg += "<p style='background-color:LightBlue'>" + office.name + "</p>";


          $(office.officialIndices).each(function (index, officialIndex) {
            var official = officials[officialIndex];
            msg += "<p>" + official.name + "</p>";
          });
        })
      }

      d3.select("#representatives").html(msg);

      url = null;
      msg = null;
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
        if (error) {
          console.log(error);
        } else {
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

          LL = null;
          items = null;
          url = null;
          levels = null;
          msg = null;
        }

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

        LL = null;
        url = null;
        data = null;
        msg = null;
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

  var coords = null;
  var dist = null;

  $(features).each(function () {
    var f = $(this);
    if (f && f[0]) {
      if (f[0].geometry.coordinates[0].length) {
        if (f[0].geometry.coordinates[0][0].length) {
          coords = f[0].geometry.coordinates[0][0][0];
        } else {
          coords = f[0].geometry.coordinates[0][0];
        }
      } else {
        coords = f[0].geometry.coordinates;
      }
      dist = d3.geoDistance(coords, ll); // distance in radians
      if (dist < closest.distance) {
        closest.distance = dist;
        closest.item = f;
      }
    }
  });


  closest.distance = closest.distance != 9999 ? parseFloat(closest.distance) * 3959 : 9999; // 3959 is Earth radius in miles
  closest.distance = closest.distance.toFixed(2);

  coords = null;
  dist = null;

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

  flags = null;

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