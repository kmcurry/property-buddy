function getSafetyData(DataDirectory, ll) {
    console.log("Determining SpotProperty...")
    getCodeEnforcement(DataDirectory.property.codeEnforcement, ll, 1, 30);
    
}


function getCodeEnforcement(codeEnforcement, ll, dist, days) {
    if (!codeEnforcement) return;

    getCountWithinDays(codeEnforcement, ll, dist, days, "code-enforcement").then(function (codeEnforcement) {
        if (codeEnforcement) {

            d3.select("#code-enforcement").html(codeEnforcement.length);

            codeEnforcement = codeEnforcement.sort(function (a, b) {
                return new Date(b.open_date) - new Date(a.open_date);
            });
            var html = "<thead>";
            html += "<tr style='font-size:18px;font-weight:600;'>";
            html += "<td>DATE</td>";
            html += "<td>ADDRESS</td>";
            html += "<td>SUBDIVISION</td>";
            html += "<td>VIOLATION</td>";
            html += "<td>INSPECTION TYPE</td>";
            html += "</tr>";
            html += "<thead>";
            html += "<tbody>";
            var _time;
            var HH;
            var MM;
            $(crashes).each(function (index, codeEnforcement) {
                html += "<tr style='font-size:18px;'>";
                html += "<td>" + moment(codeEnforcement.open_date).format("MM-DD-YYYY") + "</td>";
                html += "<td>" + codeEnforcement.location1_address + "</td>";
                html += "<td>" + codeEnforcement.sub_division + "</td>";
                html += "<td>" + codeEnforcement.violation + "</td>";
                html += "<td>" + codeEnforcement.inspection_type + "</td>";
                html += "</tr>";
            })
            html += "</tbody>"
            $("#code-enforcement-table").append(html);
            codeEnforcement = null;
            $('#code-enforcement-table').DataTable({
                paging:false
            });
        } else {
            console.log("No Data from getCountWithinDays")
        }
    });
}
