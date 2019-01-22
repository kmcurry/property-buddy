var VirginiaBeach = {

  boundary: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/Administrative_Boundaries/MapServer/0/",
  neighborhoods: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PropertyInformation_VBgov/MapServer/13/",
  council: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/VotingDistricts/MapServer/2/",

  property: {
    AICUZ: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/AICUZ/MapServer/3/",
    sales: "https://data.vbgov.com/resource/p3zb-bkwc.json",
    code_enforcement: "https://data.vbgov.com/resource/s5fx-f3pf.json"
  },

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
    crashes: "https://data.vbgov.com/resource/mbi3-8v8n.json",
    incidents: "https://data.vbgov.com/resource/r37t-tt64.json",
    precincts: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/Administrative_Boundaries/MapServer/8/",
    zones: "https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/Administrative_Boundaries/MapServer/9/"
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
      elementary: "https://services5.arcgis.com/36soGIYKLrgDhHrr/ArcGIS/rest/services/VBCPS_2018_2019ESAttendanceZone/FeatureServer/0",
      middle: "https://services5.arcgis.com/36soGIYKLrgDhHrr/ArcGIS/rest/services/VBCPS_2018_2019MSAttendanceZone/FeatureServer/0",
      high: "https://services5.arcgis.com/36soGIYKLrgDhHrr/ArcGIS/rest/services/20182019_HSAttendanceZone/FeatureServer/0"
    }
  },
  transportation: {
    bus_stops: "https://gismaps.vbgov.com/arcgis/rest/services/Planning_and_Development/Public_Transportation/MapServer/0"
  }

};

module.exports = VirginiaBeach;