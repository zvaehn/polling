module.exports = function(grunt) {

  var config = {
    pkg: grunt.file.readJSON('package.json')
  };

  grunt.initConfig({

    compass: {
      dist: {
        options: {
          config: 'core/public/sass/config.rb',
          environment: 'production',
          sassDir: 'core/public/sass',
          cssDir: 'core/public/css/dist'
        }
      },
      dev: {
        options: {
          config: 'sass/config.rb',
          environment: 'development',
          sassDir: 'core/public/sass',
          cssDir: 'core/public/css'
        }
      }
    },

    uglify: {
      build: {
        src: 'core/public/js/dist/scripts.js',
        dest: 'core/public/js/dist/scripts.min.js'
      }
    },

    jshint: {
      beforeconcat: ['Gruntfile.js', 'package.json', 'core/public/js/*.js']
    },

    concat: {
      dist: {
        src: 'core/public/js/*.js',
        dest: 'core/public/js/dist/scripts.js'
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'core/public/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'core/public/img/'
        }]
      }
    },

    focus: {
      dev: {
        exclude: ['cssdist', 'scriptsdist']
      }
    },


    watch: {
      cssdev: {
        files: ['core/public/sass/**/*.scss'],
        tasks: ['compass:dev'],
        options: {
          spawn: false,
        }
      },

      cssdist: {
        files: ['core/public/sass/**/*.scss'],
        tasks: ['compass:dist'],
        options: {
          spawn: false,
        }
      },

      scriptsdist: {
        files: ['core/public/js/*.js'],
        tasks: ['jshint', 'concat', 'uglify'],
        options: {
          spawn: false,
        }
      },

      scriptsdev: {
        files: ['core/public/js/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        }
      },

      grunt: {
        files: ['Gruntfile.js', 'package.json'],
        tasks: ['jshint']
      }
    }

  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['compass:dev','compass:dist','watch']);
  grunt.registerTask('img', ['imagemin']);
  grunt.registerTask('dev', ['compass:dev', 'focus:dev']);
};