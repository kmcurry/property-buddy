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
        getFeaturesForLocation(addr, searchPosition);
      })
      .catch(function (err) {
        console.error(err);
      });
  
  })