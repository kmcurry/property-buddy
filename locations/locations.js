var locations = {};

locations.NC = {};
locations.NC.Raleigh  = require('./NorthCarolina/Raleigh');

locations.VA = {};
locations.VA.Chesapeake    = require('./Virginia/Chesapeake');
locations.VA.FallsChurch   = require('./Virginia/FallsChurch');
locations.VA.Norfolk       = require('./Virginia/Norfolk');
locations.VA.VirginiaBeach = require('./Virginia/VirginiaBeach');

module.exports = locations;
