function getSafetyData(DataDirectory, ll) {
    getEvacuationZone(locations[statePath].evacuation, ll);
    getPolicePrecinct(DataDirectory.police.precincts, ll);
    getPolicePatrolZone(DataDirectory.police.zones, ll);
    getPoliceIncidents(DataDirectory.police.incidents, ll, .5, 30);
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

        LL = null;

    });
}

function getPoliceIncidents(incidents, ll, dist, days) {
    if (!incidents) return;

    getCountWithinDays(incidents, ll, dist, days, "police-incidents").then(function (incidents) {
        if (incidents) {
            // console.log("Police Incidents")
            console.log(incidents);
            var html = "<table style='width:100%;'>";
            incidents = incidents.sort(function (a, b) {
                return new Date(b.date_occured) - new Date(a.date_occured);
            });
            console.log(incidents);
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
            incidents = null;
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
        url: url
    }).intersects(LL).run(function (error, data) {

        if (error) {
            console.log(error);
            return;
        }

        if (data && data.features && data.features[0]) {
            //console.log(data.features[0]);
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
        url: url
    }).intersects(LL).run(function (error, data) {

        if (error) {
            console.log(error);
            return;
        }

        if (data && data.features && data.features[0]) {
            console.log(data.features[0]);
            var precinct = data.features[0].properties.PRECINCT ? data.features[0].properties.PRECINCT : data.features[0].properties.Precinct;
            d3.select("#police-precinct").html(precinct); //+ "<a href=''>Zone Map</a>");
        } else {
            d3.select("#police-precinct").html("No Features in Precinct data set");
        }

        LL = null;
        data = null;

    });
}