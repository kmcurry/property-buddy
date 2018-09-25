var Richmond = {

  boundary: "",
  neighborhoods: "https://data.richmondgov.com/resource/7juf-nwis.json",
  AICUZ: "",
  FIRM: "",
  evacuation: "https://services3.arcgis.com/qVupYidwzMKkDQzr/arcgis/rest/services/Hurricane_Evacuation_Zones_Expanded/FeatureServer/0",

  property: {
    AICUZ: "",
    FIRM: "",
    sales: ""
  },

  fire: {
    calls: "",
    districts: "",
    hydrants: {
      public: "",
      private: ""
    },
    incidents: ""
  },

  medical: {
    emergency: {
      calls: ""
    },
    facilities: "",
    hospitals: ""
  },

  police: {
    calls: "",
    incidents: ""
  },

  recreation: {
    centers: "",
    greenways: "",
    libraries: "",
    parks: "",
    trails: "",
    water: ""
  },
  schools: {
    all: "",
    elementary: "",
    high: "",
    middle: "",
    pre: ""
  }
};

module.exports = Richmond;
