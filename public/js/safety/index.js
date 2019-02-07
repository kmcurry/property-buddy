$(document).ready(function () {
  
    locations = $("#locations").val();
    locations = JSON.parse(locations);
    geoCoderKey = $("#geoCoderKey").val();
    GApisKey = $("#GApisKey").val();

    searchPosition = $("#searchPosition").val();
    searchPosition = searchPosition.split(',');

    $(document).tooltip();
    
    getAddress(searchPosition)
      .then(function (address) {
        var addr = address;
        d3.select("#address").html(address.formatted_address);
        loadDataDirectory(address);

        var ll = null;

        // LON LAT unless locally manipulated b/c D3 is LON LAT
        if (searchPosition.coords) {
            ll = [searchPosition.coords.longitude, searchPosition.coords.latitude];
        } else {
            ll = [searchPosition[1], searchPosition[0]];
        }

        getSafetyData(DataDirectory, ll);
        
      })
      .catch(function (err) {
        console.error(err);
      });
  
  })