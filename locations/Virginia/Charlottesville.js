var Charlottesville = {

  boundary: "https://opendata.arcgis.com/datasets/43253262b4da436bbac25d8cdb2f043b_44.geojson",
  neighborhoods: "",
  representatives: "https://www.googleapis.com/civicinfo/v2/representatives",
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
    incidents: "https://opendata.arcgis.com/datasets/6d17dc31b79943ee9214d048ec46be53_16.geojson"
  },

  recreation: {
    centers: "",
    greenways: "",
    libraries: "",
    parks: "https://opendata.arcgis.com/datasets/a13bdf43fff04168b724a64f7dca234d_19.geojson",
    trails: "https://opendata.arcgis.com/datasets/5d79c6a3e6d44a758063c59c8e00b2dc_18.geojson",
    water: ""
  },

  schools: {
    all: "",
    elementary: "https://opendata.arcgis.com/datasets/6d17dc31b79943ee9214d048ec46be53_16.geojson",
    high: "",
    middle: "",
    pre: ""
  }
};

module.exports = Charlottesville;