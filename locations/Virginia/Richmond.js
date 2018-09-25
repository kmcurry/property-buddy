var Richmond = {

  boundary: "",
  neighborhoods: "https://data.richmondgov.com/resource/7juf-nwis.json",
  
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
