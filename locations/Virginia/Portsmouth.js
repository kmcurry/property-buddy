var Portsmouth = {

    boundary: "http://www2.portsmouthva.gov/arcgisweb/rest/services/StandardLayers/MapServer/4",
    neighborhoods: "http://www2.portsmouthva.gov/arcgisweb/rest/services/ArcGIS_Online_GDB/MapServer/12",
    representatives: "https://www.googleapis.com/civicinfo/v2/representatives",
    evacuation: "https://services3.arcgis.com/qVupYidwzMKkDQzr/arcgis/rest/services/Hurricane_Evacuation_Zones_Expanded/FeatureServer/0",

    property: {
      AICUZ: "",
      FIRM: "http://www2.portsmouthva.gov/arcgisweb/rest/services/Environment/MapServer/8",
      sales: ""
    },
  
    fire: {
      calls: "",
      districts: "",
      hydrants: {
        public: "http://www2.portsmouthva.gov/arcgisweb/rest/services/PublicSafety/MapServer/3",
        private: ""
      },
      incidents: "",
      stations: "http://www2.portsmouthva.gov/arcgisweb/rest/services/PublicSafety/MapServer/2"
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
      parks: "http://www2.portsmouthva.gov/arcgisweb/rest/services/Environment/MapServer/3",
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
  
  module.exports = Portsmouth;
  