var Norfolk = {

  boundary: "https://data-orf.opendata.arcgis.com/datasets/5fcd6cdbd5a84e0fae5db8c35465ad54_2.geojson",
  AICUZ: "https://data-orf.opendata.arcgis.com/datasets/c8de1a1f81e14eacbe381ae342318031_8.geojson",
  FIRM: "https://orfmaps.gov/orfgis/rest/services/OpenData/Planning_and_Zoning/MapServer/1",
  neighborhoods: "https://raw.githubusercontent.com/blackmad/neighborhoods/master/geojson", // THIRD PARTY

  fire: {
    calls: "",
    hydrants: {
      public: "",
      private: ""
    }
  },

  medical: {
    emergency: {
      calls: ""
    },
    hospitals: "https://data-orf.opendata.arcgis.com/datasets/77a29d702d1b416fa1e4ffe0d52e6cac_0.geojson",
  },

  police: {
    calls: "",
    incidents: ""
  },

  recreation: {
    centers: "https://data-orf.opendata.arcgis.com/datasets/fcaa90ef89de4e17bb2b958915d88ab3_0.geojson",
    libraries: "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_4.geojson",
    parks: "https://data-orf.opendata.arcgis.com/datasets/fcaa90ef89de4e17bb2b958915d88ab3_1.geojson",
  },

  schools: {
    all: "https://data-orf.opendata.arcgis.com/datasets/0c8de8e20bba46a283bb1062f276fe33_0.geojson",
    pre: "",
    elementary: "",
    middle: "",
    high: ""
  }

};

module.exports = Norfolk;
