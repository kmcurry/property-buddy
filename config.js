var config = {};

config.Norfolk = {};
config.VirginiaBeach = {};

config.Norfolk.boundary = "https://data-orf.opendata.arcgis.com/datasets/5fcd6cdbd5a84e0fae5db8c35465ad54_2.geojson";
config.Norfolk.AICUZ = "https://data-orf.opendata.arcgis.com/datasets/c8de1a1f81e14eacbe381ae342318031_8.geojson";
config.Norfolk.FIRM = "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Planning_and_Zoning/MapServer/1";
config.Norfolk.hydrants = "";
config.Norfolk.libraries = "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_4.geojson";
config.Norfolk.parks = "https://data-orf.opendata.arcgis.com/datasets/fcaa90ef89de4e17bb2b958915d88ab3_1.geojson";
// TODO: handle diff btwn NFK & VB
config.Norfolk.schools = {
  elementary: "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_0.geojson",
  middle: "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_0.geojson",
  high: "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_0.geojson"
}

config.VirginiaBeach.boundary = "https://gis-vbgov.opendata.arcgis.com/datasets/909c0188a44341a5aa6d39951ce8f984_19.geojson";
config.VirginiaBeach.AICUZ = "https://gis-vbgov.opendata.arcgis.com/datasets/3088488c6c284f3981d61b9efe9c1d04_3.geojson";
config.VirginiaBeach.FIRM = "https://gismaps.vbgov.com/arcgis/rest/services/Public_Safety/Flood_Zones_2015/MapServer/2/";
config.VirginiaBeach.hydrants = "https://gis-vbgov.opendata.arcgis.com/datasets/a12e7ee1d4da422b8e711f60aedf8849_0.geojson";
config.VirginiaBeach.libraries = "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_0.geojson";
config.VirginiaBeach.parks = "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_7.geojson";
config.VirginiaBeach.recCenters = "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_4.geojson";
config.VirginiaBeach.schools = {
  elementary: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_1.geojson",
  middle: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_2.geojson",
  high: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_3.geojson"
}


module.exports = config;
