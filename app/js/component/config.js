define(function(require) {

  'use strict';

  // TODO use envvars for this.
  var apiVersion = 'v0';

  var config = {};
  config.API_VERSION = apiVersion;
  config.API_PREFIX = '/api/'+ apiVersion;

  return config;
});
