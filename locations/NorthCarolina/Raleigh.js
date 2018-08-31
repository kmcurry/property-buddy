var Raleigh = {

  boundary: "",
  AICUZ: "",
  FIRM: "",
  neighorhoods: "http://data-ral.opendata.arcgis.com/datasets/7155aafedeec477d9a86e80223ba30ce_0.geojson",

  fire: {
    districts: "http://data-ral.opendata.arcgis.com/datasets/571a9c3081bf4ea39c673fcca7cb40ef_9.geojson",
    hydrants: {
      public: "",
      private: ""
    },
    calls: "",
    incidents: "https://data.raleighnc.gov/resource/nqdf-wvzj.json"
  },

  medical: {
    emergency: {
      calls: ""
    },
    facilities: "http://data-ral.opendata.arcgis.com/datasets/d2e9a24d864043a4b788452c1b267617_2.geojson",
    hospitals: ""
  },

  police: {
      calls: "",
      incidents: ""
  },

  recreation: {
    centers: "",
    greenways: "http://data-ral.opendata.arcgis.com/datasets/45ae6c06074a4a9c9926346e1ef4425b_0.geojson",
    parks: "http://data-ral.opendata.arcgis.com/datasets/5a211ae2f9974f3b814438d5f3a5d783_12",
    libraries: "",
    trails: "http://data-ral.opendata.arcgis.com/datasets/a05e7a500d064e0e916b7e2ac1ae352e_1.geojson",
    water: ""
  },

  representatives: "https://www.googleapis.com/civicinfo/v2/representatives/",

  schools: {
    all: "",
    pre: "",
    elementary: "",
    middle: "",
    high: ""
  }

};


module.exports = Raleigh;
