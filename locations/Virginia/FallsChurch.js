var FallsChurch = {

  boundary: "https://maps-fallschurch.opendata.arcgis.com/datasets/a5ad578107894319b75c8ea00fe0a987_0.geojson",
  neighborhoods: "",
  AICUZ: "",
  FIRM: "",

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
    parks: "https://maps-opendata.arcgis.com/datasets/83b0e306cfc447a19752cd391e17b348_0.geojson",
    libraries: "",
    trails: "",
    water: ""
  },

  schools: {
    all: "",
    pre: "",
    elementary: "",
    middle: "",
    high: ""
  }

};

module.exports = FallsChurch;
