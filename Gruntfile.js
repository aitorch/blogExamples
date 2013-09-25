'use strict';

var mountFolder = function(folder, mountPoint){
  mountPoint || (mountPoint = '/');
  var express = require('express');
  var app = express();
  app.use(mountPoint, express.static(folder));
  app.use(mountPoint, express.directory(folder));
  return app;
}

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep')
      .filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    connect: {
      options: {
        hostname: '0.0.0.0',
        middleware: function(connect){
          return [
            mountFolder('app', '/app'),
            mountFolder('bower_components', '/components'),
            mountFolder('docs/out/', '/docs'),
            mountFolder('docs/src/partials/examples', '/specs/examples'),
            mountFolder('specs', '/specs')
          ];
        }
      },
      server: {
        options: { port: 3000 }
      },
      specs: {
        options: { port: 8080 }
      }
    },

    clean: {
      server: ['docs/out']
    },

    docs: {
      srcPath: 'docs/src',
      outPath: 'docs/out'
    },

    regarde: {
      docs: {
        files: [
          'docs/src/**/*.{eco,html,js}'
        ],
        tasks: ['docs']
      }
    },

    exec: {
      phantomSpecs: {
        cmd: 'phantomjs specs/phantom_spec_runner.js'
      }
    }

  });

  grunt.registerTask('server',
                     ['clean', 'docs', 'connect:server', 'regarde']);

  grunt.registerTask('specs',
                     ['clean', 'connect:specs', 'exec:phantomSpecs']);

};
