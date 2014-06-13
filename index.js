/**
 * Starting point
 */

var polling = require('./core');

// Save current directory in global
// to access ./public/
__root = __dirname;

polling();