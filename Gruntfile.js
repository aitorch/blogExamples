'use strict';

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

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
          middleware: function (connect) {
            return [
              mountFolder(connect, 'docs/out')
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
      outPath: 'docs/out/docs'
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
