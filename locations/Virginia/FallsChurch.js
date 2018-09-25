var FallsChurch = {

  boundary: "https://maps-fallschurch.opendata.arcgis.com/datasets/a5ad578107894319b75c8ea00fe0a987_0.geojson",
  neighborhoods: "",
  evacuation: "https://services3.arcgis.com/qVupYidwzMKkDQzr/arcgis/rest/services/Hurricane_Evacuation_Zones_Expanded/FeatureServer/0",

  property: {
    AICUZ: "",
    FIRM: "",
    sales: ""
  },

  fire: {
    hydrants: {
      public: "",
      private: ""
    },
    calls: ""
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
    parks: "https://services1.arcgis.com/2hmXRAz4ofcdQP6p/arcgis/rest/services/Parks/FeatureServer/0/",
    libraries: "",
    trails: "",
    water: ""
  },

  schools: {
    all: "https://services1.arcgis.com/2hmXRAz4ofcdQP6p/arcgis/rest/services/Schools/FeatureServer/0/",
    pre: "",
    elementary: "",
    middle: "",
    high: ""
  }

};

module.exports = FallsChurch;
