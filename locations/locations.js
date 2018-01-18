var locations = {};

locations.NorthCarolina = {};
locations.NorthCarolina.Raleigh  = require('./NorthCarolina/Raleigh');

locations.Virginia = {};
locations.Virginia.Chesapeake    = require('./Virginia/Chesapeake');
locations.Virginia.FallsChurch   = require('./Virginia/FallsChurch');
locations.Virginia.Norfolk       = require('./Virginia/Norfolk');
locations.Virginia.VirginiaBeach = require('./Virginia/VirginiaBeach');

module.exports = locations;
