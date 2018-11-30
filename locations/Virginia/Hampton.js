var Hampton = {

  boundary: "http://webgis.hampton.gov/ArcGIS/rest/services/Public/MapServer/57/",
  neighborhoods: "http://webgis.hampton.gov/arcgis/rest/services/Public/MapServer/11/",
  
  property: {
    AICUZ: "http://webgis.hampton.gov/ArcGIS/rest/services/Public/MapServer/18/",
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
  },
  transportation: {
    bus_stops: ""
  }
};

module.exports = Hampton;