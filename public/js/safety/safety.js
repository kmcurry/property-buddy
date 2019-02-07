function getSafetyData(DataDirectory, ll) {
    getPolicePrecinct(DataDirectory.police.precincts, ll);
    getPolicePatrolZone(DataDirectory.police.zones, ll);
    getPoliceIncidents(DataDirectory.police.incidents, ll, 1, 30);
    getPoliceCalls(DataDirectory.police.calls, ll, 1, 30);
    getAverageResponseTime(DataDirectory.medical.emergency.calls, ll, 1, "ems");
    getAverageResponseTime(DataDirectory.police.calls, ll, 1, "police");
    getCrashes(DataDirectory.police.crashes, ll, 1, 30);
    getEvacuationZone(locations[statePath].evacuation, ll);
    getClosestThing(DataDirectory.shelters, ll, "emergency-shelter", "miles");
    
    //getClosestThing(DataDirectory.fire.hydrants.public, ll, "hydrant-public", "feet");
    // getClosestThing(DataDirectory.fire.hydrants.private, ll, "hydrant-private", "feet");
}

function getEvacuationZone(url, ll) {
    if (!url || url == "") {
        d3.select("#evacuation").html("Needs data source");
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
            var evacZone = data.features[0].properties.Zone ? data.features[0].properties.Zone : "UNKNOWN";
            d3.select('#modal-body').html(evacZone);
            //$('#notice').modal('show'); // uncomment during evac order
            d3.select("#evacuation").html(evacZone);
        } else {
            d3.select("#evacuation").html("No Features in Evacuation data set");
        }

        LL = null;

    });
}

function getCrashes(crashes, ll, dist, days) {
    if (!crashes) return;

    getCountWithinDays(crashes, ll, dist, days, "crash-count").then(function (crashes) {
        if (crashes) {
            crashes = crashes.sort(function (a, b) {
                return new Date(b.accident_date) - new Date(a.accident_date);
            });
            var html = "<thead>";
            html += "<tr style='font-size:18px;font-weight:600;'>";
            html += "<td>DATE</td>";
            html += "<td>BLOCK ADDRESS</td>";
            html += "<td>NEAR</td>";
            html += "<td>TIME</td>";
            html += "<td>DAY</td>";
            html += "</tr>";
            html += "<thead>";
            html += "<tbody>";
            var _time;
            var HH;
            var MM;
            $(crashes).each(function (index, crash) {
                html += "<tr style='font-size:18px;'>";
                html += "<td>" + moment(crash.accident_date).format("MM-DD-YYYY") + "</td>";
                html += "<td>" + crash.location_1_address + "</td>";
                html += "<td>" + crash.nearest_street + "</td>";
                _time = crash.accident_time.toString();
                if (_time.length === 3) {   // time is 24HR but times that start with 0 are stored as 3 digits
                    _time = "0" + _time;
                }
                HH = _time.substring(0,2);
                MM = _time.substring(1,3);
                html += "<td>" + HH + ":" + MM + "</td>";
                html += "<td>" + crash.day_of_week + "</td>";
                html += "</tr>";
            })
            html += "</tbody>"
            $("#police-crash-table").append(html);
            crashes = null;
            $('#police-crash-table').DataTable({
                paging:false
            });
        } else {
            console.log("No Data from getCountWithinDays")
        }
    });
}

function getPoliceCalls(calls, ll, dist, days) {
    if (!calls) return;

    getCountWithinDays(calls, ll, dist, days, "police-calls").then(function (calls) {
        if (calls) {
            calls = calls.sort(function (a, b) {
                return new Date(b.call_date_time) - new Date(a.call_date_time);
            });
            var html = "<thead>";
            html += "<tr style='font-size:18px;font-weight:600;'>";
            html += "<td>DAY</td>";
            html += "<td>DATE</td>";
            html += "<td>TIME</td>";
            html += "<td>TYPE</td>";
            html += "<td>BLOCK ADDRESS</td>";
            html += "<td>DISPOSITION</td>"
            html += "</tr>";
            html += "<thead>";
            html += "<tbody>";
            $(calls).each(function (index, call) {
                /*
                var statusStyle = "unfounded";
                switch (call.case_disposition) {
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
                */
                html += "<tr style='font-size:18px;'>";
                var dayDateTime = moment(call.call_date_time);
                html += "<td>" + dayDateTime.format("dddd") + "</td>";
                html += "<td>" + dayDateTime.format("l") + "</td>";
                html += "<td>" + dayDateTime.format("LT") + "</td>";
                html += "<td>" + call.call_type + "</td>";
                html += "<td>" + call.location_1_address + "</td>";
                html += "<td>" + call.case_disposition + "</td>"
                html += "</tr>";
            })
            html += "</tbody>"
            $("#police-calls-table").append(html);
            calls = null;
            $('#police-calls-table').DataTable({
                paging:false
            });
        } else {
            console.log("No Data from getCountWithinDays")
        }
    });
}


function getPoliceIncidents(incidents, ll, dist, days) {
    if (!incidents) return;

    getCountWithinDays(incidents, ll, dist, days, "police-incidents").then(function (incidents) {
        if (incidents) {
            incidents = incidents.sort(function (a, b) {
                return new Date(b.date_occured) - new Date(a.date_occured);
            });
            var html = "<thead>";
            html += "<tr style='font-size:18px;font-weight:600;'>";
            html += "<td>DAY</td>";
            html += "<td>DATE</td>";
            html += "<td>TIME</td>";
            html += "<td>DESCRIPTION</td>";
            html += "<td>BLOCK ADDRESS</td>";
            html += "<td>STATUS</td>"
            html += "</tr>";
            html += "<thead>";
            html += "<tbody>";
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
                html += "<tr class='" + statusStyle + "' style='font-size:18px;'>";
                var dayDateTime = moment(incident.date_occured);
                html += "<td>" + dayDateTime.format("dddd") + "</td>";
                html += "<td>" + dayDateTime.format("l") + "</td>";
                html += "<td>" + dayDateTime.format("LT") + "</td>";
                html += "<td>" + incident.offense_description + "</td>";
                html += "<td>" + incident.location_1_address + "</td>";
                html += "<td>" + incident.case_status + "</td>"
                html += "</tr>";
            });
            html += "</tbody>";
            $("#police-incidents-table").append(html);
            incidents = null;
            $('#police-incidents-table').DataTable({
                paging:false
            });
        } else {
            console.log("No Data from getCountWithinDays")
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
        url: url,
        returnGeometry: false
    }).intersects(LL).run(function (error, data) {

        if (error) {
            console.log(error);
            return;
        }

        if (data && data.features && data.features[0]) {
            var patrolZone = data.features[0].properties.BEAT ? data.features[0].properties.BEAT : data.features[0].properties.Car_Sector;
            d3.select("#police-patrol").html(patrolZone); //+ "<a href=''>Zone Map</a>");
        } else {
            d3.select("#police-patrol").html("No Features in Patrol Zone data set");
        }

        LL = null;
        data = null;

    });
}

function getPolicePrecinct(url, ll) {
    if (!url || url == "") {
        d3.select("#police-precinct").html("Needs data source");
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
            var precinct = data.features[0].properties.PRECINCT ? data.features[0].properties.PRECINCT : data.features[0].properties.Precinct;
            d3.select("#police-precinct").html(precinct); //+ "<a href=''>Zone Map</a>");
        } else {
            d3.select("#police-precinct").html("No Features in Precinct data set");
        }

        LL = null;
        data = null;

    });
}