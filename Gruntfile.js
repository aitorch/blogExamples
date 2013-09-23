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
        port: 3000,
        hostname: '0.0.0.0'
      },

      server: {
        options: {
          middleware: function(connect){
            return [
              mountFolder('bower_components', '/components'),
              mountFolder('docs/out/', '/docs'),
              mountFolder('docs/src/partials', '/specs/examples'),
              mountFolder('specs', '/specs'),
              require('./specs/live_editor_app.js')
            ];
          }
        }
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
    }

  });

  grunt.registerTask('server',
                     ['clean', 'docs', 'connect', 'regarde']);

};
