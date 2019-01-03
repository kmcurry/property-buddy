$(document).ready(function () {
  
    geoCoderKey = $("#geoCoderKey").val();
    GApisKey = $("#GApisKey").val();

    //console.log(locations);
    searchPosition = $("#searchPosition").val();
    //console.log(searchPosition);
    searchPosition = searchPosition.split(',');

    $(document).tooltip();
    console.log("DOCUMENT IS READY");
  
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