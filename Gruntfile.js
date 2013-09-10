'use strict';

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    connect: {
      options: {
        port: 3000,
        hostname: '0.0.0.0'
      },
      server: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'app'),
            ];
          }
        }
      }
    }

  });

  grunt.registerTask('server', [
    'connect:server:keepalive'
  ]);

};
