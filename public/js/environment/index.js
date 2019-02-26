async function getFloodZone(url, ll) {
    var promise = new Promise(function (resolve, reject) {
      if (!url || url == "") {
        d3.select("#flood").html("Needs data source");
        resolve;
        return;
      }
  
      var LL = L.latLng(ll[1], ll[0]);
      // use location to find out which census block they are inside.
      var query = L.esri.query({
        url: url,
        returnGeometry: false,
        timeout: 5000
      });
      query.intersects(LL);
      query.run(function (error, data) {
        
        var floodZone = "";
  
        if (error) {
          console.log(error);
          if (error.code == 500) {
            floodZone = "X"
          } else {
            floodZone = "Could not determine flood zone";
          }
          LL = null;
          console.log("Flood Zone Determined by Timeout: " + floodZone);
          d3.select("#flood").html(floodZone); //+ "<a href=''>Zone Map</a>");
          resolve;
        }
  
        if (data) {
  
          if (data && data.features && data.features[0]) {
            floodZone = data.features[0].properties.FLD_ZONE ? data.features[0].properties.FLD_ZONE : "UNKNOWN";
            console.log("Flood Zone: " + floodZone);
            d3.select("#flood").html(floodZone); //+ "<a href=''>Zone Map</a>");
            LL = null;
            data = null;
            resolve;
          } else {
            d3.select("#flood").html("No Features in Flood Zone data set");
            LL = null;
            data = null;
            resolve;
          }
        }
  
      });
    });
  
    return promise;
  }