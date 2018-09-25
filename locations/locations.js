var locations = {};

locations.UnitedStates = require('./UnitedStates.js')

locations.NorthCarolina = {};
locations.NorthCarolina.Raleigh  = require('./NorthCarolina/Raleigh');

locations.Virginia = {};
locations.Virginia.Chesapeake       = require('./Virginia/Chesapeake');
locations.Virginia.Charlottesville  = require('./Virginia/Charlottesville');
locations.Virginia.FallsChurch      = require('./Virginia/FallsChurch');
locations.Virginia.Hampton          = require('./Virginia/Hampton');
locations.Virginia.NewportNews      = require('./Virginia/NewportNews');
locations.Virginia.Norfolk          = require('./Virginia/Norfolk');
locations.Virginia.Portsmouth       = require('./Virginia/Portsmouth');
locations.Virginia.Richmond         = require('./Virginia/Richmond');
locations.Virginia.VirginiaBeach    = require('./Virginia/VirginiaBeach');

module.exports = locations;
