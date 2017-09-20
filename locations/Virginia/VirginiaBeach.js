var VirginiaBeach = {

  boundary: "http://gis-vbgov.opendata.arcgis.com/datasets/909c0188a44341a5aa6d39951ce8f984_19.geojson",
  neighborhoods: "https://gis-vbgov.opendata.arcgis.com/datasets/909c0188a44341a5aa6d39951ce8f984_13.geojson",
  AICUZ: "https://gis-vbgov.opendata.arcgis.com/datasets/3088488c6c284f3981d61b9efe9c1d04_3.geojson",
  FIRM: "https://gismaps.vbgov.com/arcgis/rest/services/Public_Safety/Flood_Zones_2015/MapServer/2/",

  fire: {
    calls: "",
    hydrants: {
      public: "https://gis-vbgov.opendata.arcgis.com/datasets/a12e7ee1d4da422b8e711f60aedf8849_0.geojson",
      private: ""
    }
  },

  medical: {
    hospitals: "",
    emergency: {
      calls: "https://data.vbgov.com/resource/q2jp-nt6m.json"
    }
  },

  police: {
      calls: "https://data.vbgov.com/resource/rqn2-9am9.json",
      incidents: "https://data.vbgov.com/resource/r37t-tt64.json"
  },

  recreation: {
    centers: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_4.geojson",
    parks: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_7.geojson",
    libraries: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_0.geojson",
    trails: "",
    water: ""
  },

  schools: {
    locations: {
      all: "",
      pre: "",
      elementary: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_1.geojson",
      middle: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_2.geojson",
      high: "https://gis-vbgov.opendata.arcgis.com/datasets/4ee34e8a8aea431ea329743a71c2fd61_3.geojson"
    },
    zones: {
      all: "",
      pre: "",
      elementary: "",
      middle: "",
      high: ""
    }
  }

};

module.exports = VirginiaBeach;
