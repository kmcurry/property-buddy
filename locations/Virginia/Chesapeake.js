var Chesapeake = {

  boundary: "https://public-chesva.opendata.arcgis.com/datasets/e68ee91297f448188ec30034b1ac27be_31.geojson",
  neighborhoods: "https://public-chesva.opendata.arcgis.com/datasets/e8a4bed38fdf403ca5479779884aadc2_3.geojson",
  
  property: {
    AICUZ: "https://public-chesva.opendata.arcgis.com/datasets/77ba67c5fbc84d40a5002e3e02d046cb_3.geojson",
    sales: ""
  },

  fire: {
    calls: "",
    hydrants: {
      public: "",
      private: ""
    }
  },

  medical: {
    hospitals: "",
    emergency: {
      calls: ""
    }
  },

  police: {
    calls: "",
    incidents: ""
  },

  recreation: {
    centers: "",
    parks: "https://public-chesva.opendata.arcgis.com/datasets/e77a9aa5e12a4194b15ae6cb6dadc578_14.geojson",
    libraries: "",
    trails: "",
    water: "https://public-chesva.opendata.arcgis.com/datasets/98a64c1c912c4be6b27156232334b366_4.geojson"
  },

  schools: {
    all: "",
    pre: "",
    elementary: "",
    middle: "",
    high: ""
  }

};


module.exports = Chesapeake;