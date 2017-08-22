var config = {};

config.Chesapeake = {};
config.Norfolk = {};
config.VirginiaBeach = {};

config.Chesapeake.boundary = "https://public-chesva.opendata.arcgis.com/datasets/e68ee91297f448188ec30034b1ac27be_31.geojson";
config.Chesapeake.AICUZ = "https://public-chesva.opendata.arcgis.com/datasets/77ba67c5fbc84d40a5002e3e02d046cb_3.geojson";
config.Chesapeake.FIRM = "";
config.Chesapeake.hospitals = "";
config.Chesapeake.hydrants = "";
config.Chesapeake.libraries = "";

config.Chesapeake.neighborhoods = "https://public-chesva.opendata.arcgis.com/datasets/e8a4bed38fdf403ca5479779884aadc2_3.geojson";

config.Chesapeake.parks = "https://public-chesva.opendata.arcgis.com/datasets/e77a9aa5e12a4194b15ae6cb6dadc578_14.geojson";
config.Chesapeake.recCenters = "";
config.Chesapeake.waterBodies = "https://public-chesva.opendata.arcgis.com/datasets/98a64c1c912c4be6b27156232334b366_4.geojson";

// TODO: handle diff btwn NFK & VB
config.Chesapeake.schools = {
  elementary: "",
  middle: "",
  high: ""
};

config.Chesapeake.emergency = {
  calls: ""
};

config.Chesapeake.police = {
    calls: "",
    incidents: ""
};

config.Norfolk.boundary = "https://data-orf.opendata.arcgis.com/datasets/5fcd6cdbd5a84e0fae5db8c35465ad54_2.geojson";
config.Norfolk.AICUZ = "https://data-orf.opendata.arcgis.com/datasets/c8de1a1f81e14eacbe381ae342318031_8.geojson";
config.Norfolk.FIRM = "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Planning_and_Zoning/MapServer/1";
config.Norfolk.hospitals = "https://data-orf.opendata.arcgis.com/datasets/77a29d702d1b416fa1e4ffe0d52e6cac_0.geojson";
config.Norfolk.hydrants = "";
config.Norfolk.libraries = "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_4.geojson";

// THIRD PARTY
config.Norfolk.neighborhoods = "https://raw.githubusercontent.com/blackmad/neighborhoods/master/norfolk.geojson";

config.Norfolk.parks = "https://data-orf.opendata.arcgis.com/datasets/fcaa90ef89de4e17bb2b958915d88ab3_1.geojson";
config.Norfolk.recCenters = "http://data-orf.opendata.arcgis.com/datasets/fcaa90ef89de4e17bb2b958915d88ab3_0.geojson";

// TODO: handle diff btwn NFK & VB
config.Norfolk.schools = {
  elementary: "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_0.geojson",
  middle: "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_0.geojson",
  high: "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_0.geojson"
};

config.Norfolk.emergency = {
  calls: ""
};

config.Norfolk.police = {
    calls: "",
    incidents: ""
};

config.VirginiaBeach.boundary = "https://gis-vbgov.opendata.arcgis.com/datasets/909c0188a44341a5aa6d39951ce8f984_19.geojson";
config.VirginiaBeach.AICUZ = "https://gis-vbgov.opendata.arcgis.com/datasets/3088488c6c284f3981d61b9efe9c1d04_3.geojson";
config.VirginiaBeach.FIRM = "https://gismaps.vbgov.com/arcgis/rest/services/Public_Safety/Flood_Zones_2015/MapServer/2/";
config.VirginiaBeach.hospitals = "";
config.VirginiaBeach.hydrants = "https://gis-vbgov.opendata.arcgis.com/datasets/a12e7ee1d4da422b8e711f60aedf8849_0.geojson";
config.VirginiaBeach.libraries = "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_0.geojson";
config.VirginiaBeach.neighborhoods = "https://gis-vbgov.opendata.arcgis.com/datasets/909c0188a44341a5aa6d39951ce8f984_13.geojson";
config.VirginiaBeach.parks = "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_7.geojson";
config.VirginiaBeach.recCenters = "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_4.geojson";

config.VirginiaBeach.schools = {
  elementary: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_1.geojson",
  middle: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_2.geojson",
  high: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_3.geojson"
};

config.VirginiaBeach.emergency = {
  calls: "https://data.vbgov.com/resource/q2jp-nt6m.json"
};

config.VirginiaBeach.police = {
    calls: "https://data.vbgov.com/resource/rqn2-9am9.json",
    incidents: "https://data.vbgov.com/resource/r37t-tt64.json"
};


module.exports = config;
