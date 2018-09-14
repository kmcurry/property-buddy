var Hampton = {

  boundary: "http://webgis.hampton.gov/ArcGIS/rest/services/Public/MapServer/57",
  neighborhoods: "http://webgis.hampton.gov/arcgis/rest/services/Public/MapServer/11",
  representatives: "https://www.googleapis.com/civicinfo/v2/representatives",
  evacuation: "https://services3.arcgis.com/qVupYidwzMKkDQzr/arcgis/rest/services/Hurricane_Evacuation_Zones_Expanded/FeatureServer/0",

  property: {
    AICUZ: "http://webgis.hampton.gov/ArcGIS/rest/services/Public/MapServer/18",
    FIRM: "http://webgis.hampton.gov/ArcGIS/rest/services/Public/MapServer/28",
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
    locations: {
      all: "",
      elementary: "",
      high: "",
      middle: "",
      pre: ""
    },
    zones: {
      elementary: "",
      high: "",
      middle: "",
      pre: ""
    }
  }
};

module.exports = Hampton;