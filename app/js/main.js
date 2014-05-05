'use strict';

requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    'component': '../js/component',
    'hoganjs': 'hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    'page': '../js/page',
    'text': 'requirejs-text/text',
    'template': '../template'
  }
});

require(
  [
    'flight/lib/compose',
    'flight/lib/registry',
    'flight/lib/advice',
    'flight/lib/logger',
    'flight/lib/debug'
  ],

  function(compose, registry, advice, withLogging, debug) {
    debug.enable(true);
    compose.mixin(registry, [advice.withAdvice]);

    require(['page/default'], function(initializeDefault) {
      initializeDefault();
    });
  }
);
