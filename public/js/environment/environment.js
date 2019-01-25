async function getFloodZone(url, ll) {
    var promise = new Promise(function (resolve, reject) {
      if (!url || url == "") {
        d3.select("#flood").html("Needs data source");
        resolve;
        return;
      }
  
      var LL = L.latLng(ll[1], ll[0]);
      // use location to find out which census block they are inside.
      L.esri.query({
        url: url,
        returnGeometry: false
      }).intersects(LL).run(function (error, data) {
  
        var msg = "";
  
        if (error) {
          console.log(error);
          resolve;
        }
  
        if (data) {
  
          if (data && data.features && data.features[0]) {
            var floodZone = data.features[0].properties.FLD_ZONE ? data.features[0].properties.FLD_ZONE : "UNKNOWN";
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