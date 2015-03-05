module.exports = function(grunt){
  pkg: grunt.file.readJSON('package.json'),

  grunt.initConfig({
	 nggettext_extract:{
	  pot: {
	    files: {
	      'po/template.pot':['**/*.html']
		}
	  },
	},
	nggettext_compile: {
	  all: {
	    files: [
			{src: ['po/*.po'], dest: 'application/resto/static/js/translations.js'},
		]
	  },
	},
    coffee: {
      app: {
        files: [{
          expand: true,
          cwd: 'application/resto/static/coffee/',
          src: ['*.coffee','!.*.coffee'],
          dest: 'application/resto/static/js/',
          ext: '.js'
        }],
        options:{
          header:true
        }
      }
    },
    less: {
      app: {
        files: [{
          expand: true,
          cwd: 'application/resto/static/less/',
          src: ['*.less', '!.*.less'],
          dest: 'application/resto/static/css/',
          ext: '.css'
        }]
      }
    },
    watch :{
      coffee: {
        files: ['**/*.coffee'],
        tasks: ['coffee'],
      },
      less: {
        files: ['**/*.less'],
        tasks: ['less'],
      }
    }
  });
  grunt.loadNpmTasks('grunt-angular-gettext');
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.registerTask('default', ['watch'])
};
