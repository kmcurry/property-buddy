var Norfolk = {

  boundary: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Municipal/MapServer/2/",
  neighborhoods: "https://raw.githubusercontent.com/blackmad/neighborhoods/master/norfolk.geojson", // THIRD PARTY
  
  property: {
    AICUZ: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Planning_and_Zoning/MapServer/8/",
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
    emergency: {
      calls: ""
    },
    hospitals: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Public_Safety/MapServer/0/",
  },

  police: {
    calls: "",
    incidents: "" //"https://data.norfolk.gov/resource/6vsy-ykpv.json"
  },

  recreation: {
    centers: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Parks_and_Rec/MapServer/0/",
    libraries: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Arts_and_Education/MapServer/4/",
    parks: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Parks_and_Rec/MapServer/1/",
  },

  schools: {
    locations: {
      all: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Arts_and_Education/MapServer/0/",
      pre: "",
      elementary: "",
      middle: "",
      high: ""
    },
    zones: {
      all: "",
      pre: "",
      elementary: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Arts_and_Education/MapServer/1/",
      middle: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Arts_and_Education/MapServer/2/",
      high: "https://orfmaps.norfolk.gov/orfgis/rest/services/OpenData/Arts_and_Education/MapServer/3/"
    }

  },
  transportation: {
    bus_stops: ""
  }

};

module.exports = Norfolk;