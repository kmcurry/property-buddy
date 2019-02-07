$(document).ready(function () {
  
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
        
      })
      .catch(function (err) {
        console.error(err);
      });
  
  })