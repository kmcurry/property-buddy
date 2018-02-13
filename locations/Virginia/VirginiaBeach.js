var VirginiaBeach = {

  boundary: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/Administrative_Boundaries/MapServer/0/",
  neighborhoods: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PropertyInformation_VBgov/MapServer/13/",
  AICUZ: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/AICUZ/MapServer/3/",
  FIRM: "https://gismaps.vbgov.com/arcgis/rest/services/Public_Safety/Flood_Zones_2015/MapServer/2/",

  fire: {
    calls: "",
    hydrants: {
      public: "https://gismaps.vbgov.com/arcgis/rest/services/Public_Utilities/Utilities_VBgov/MapServer/0/",
      private: "https://gismaps.vbgov.com/arcgis/rest/services/Public_Utilities/Utilities_VBgov/MapServer/1/"
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
    centers: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PointsOfInterest_VBgov/MapServer/4/",
    parks: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PointsOfInterest_VBgov/MapServer/7/",
    libraries: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PointsOfInterest_VBgov/MapServer/0/",
    trails: "",
    water: ""
  },

  schools: {
    locations: {
      all: "",
      pre: "",
      elementary: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PointsOfInterest_VBgov/MapServer/1/",
      middle: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PointsOfInterest_VBgov/MapServer/2/",
      high: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PointsOfInterest_VBgov/MapServer/3/"
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
