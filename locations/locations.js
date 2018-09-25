var locations = {};

locations.UnitedStates = require('./UnitedStates.js')

locations.NorthCarolina = {};
locations.NorthCarolina.Raleigh  = require('./NorthCarolina/Raleigh');

locations.Virginia = {};
locations.Virginia.Chesapeake    = require('./Virginia/Chesapeake');
locations.Virginia.FallsChurch   = require('./Virginia/FallsChurch');
locations.Virginia.Hampton       = require('./Virginia/Hampton');
locations.Virginia.Norfolk       = require('./Virginia/Norfolk');
locations.Virginia.Portsmouth    = require('./Virginia/Portsmouth');
locations.Virginia.VirginiaBeach = require('./Virginia/VirginiaBeach');

module.exports = locations;
