module.exports = function(grunt) {
	grunt.initConfig({

		// variables for project directories
		dirs: {
			webApp: {
				js: 'public_html/js',
				css: 'public_html/css',
				fonts: 'public_html/css/fonts',
				images: 'public_html/img',
				html: 'public_html/'
			},
			bower: 'bower_components',
			src: {
				app: 'javascript',
				sass: 'sass'
			// },
			// tests: {
			// 	unit: 'tests'
			}
		},

		/**************************************************************

		Concatenate files to web folder
		***************************************************************
		*
		*
		* Concatenate the following
		*  (1) Javascript files
		*  (2) CSS files
		*
		*
		***************************************************************/
		concat: {
			options: {
				separator: '\n'
			},
			appJS: {
				src: ['<%= dirs.src.app %>/app.js','<%= dirs.src.app %>/pages/**/*.js','<%= dirs.src.app %>/common/**/*.js'],
				dest: '<%= dirs.webApp.js %>/app/app.min.js'
			},
			thirdPartyJS: {
				src: [
					'<%= dirs.bower %>/jquery/dist/jquery.js',
					'<%= dirs.bower %>/bootstrap-sass/assets/javascripts/bootstrap.js',
					'<%= dirs.bower %>/angular/angular.js',
					'<%= dirs.bower %>/angular-resource/angular-resource.js',
					'<%= dirs.bower %>/angular-route/angular-route.js'
				],
				dest: '<%= dirs.webApp.js %>/thirdparty/thirdparty.min.js'
			} // TODO - prodJS using minified versions of thirdparty js
		},
		
		/**************************************************************

		Copy files to web folder
		***************************************************************
		*
		*
		* Copies the following
		*  (1) Font files
		*  (2) Thirdparty javascript files (conditionally used)
		*
		*
		***************************************************************/
		copy: {
			fonts: {
				files: [{
					expand: true,
					flatten: true,
					src: ['<%= dirs.bower %>/bootstrap-sass/assets/fonts/bootstrap/*'],
					dest: '<%= dirs.webApp.css %>/fonts/',
					filter: 'isFile'
				}]
			},
			thirdPartyJS: {
				files: [{
					expand: true,
					flatten: true,
					src: [
						'<%= dirs.bower %>/respond/dest/respond.min.js',
						'<%= dirs.bower %>/html5shiv/dist/html5shiv.min.js'
					],
					dest: '<%= dirs.webApp.js %>/thirdparty/',
					filter: 'isFile'
				}]
			},
			partials: {
				files: [{
					expand: true,
					flatten: true,
					src: ['<%= dirs.src.app %>/partials/*.html'],
					dest: '<%= dirs.webApp.js %>/app/partials/',
					filter: 'isFile'
				}]
			}
		},

		/**************************************************************

		Configure and Compile the SASS using compass
		***************************************************************
		*
		*
		* Concats the following
		*  (1) Compiles the SASS files
		*  (2) Copies them ot the WebApp directory
		*
		* NOTE:
		*  - Fonts are copied separately in the copy task
		*  - The compass config below does not like to have / at the 
		*    start of the dir name
		*
		***************************************************************/
		compass: {
			dist: {
				options: {
					httpPath: '/',
					httpImagesPath: '../images',
					imagesDir: '<%= dirs.webApp.images %>',
					sassDir: '<%= dirs.src.sass %>',
					cssDir: '<%= dirs.webApp.css %>/',
					environment: 'development',
					cacheDir: '<%= dirs.src.sass %>/.sass-cache',
					specify: '<%= dirs.src.sass %>/*.scss',
					trace: true
				}
			}
		},

		/**************************************************************

		Watches for changes to files
		***************************************************************
		*
		*
		* Watches the following for changes:
		*  (1) Scss files
		*  (2) Javascript files
		*
		*
		***************************************************************/
		watch: {
			options: {
				livereload: true
			},
			css: {
				files: '<%= dirs.src.sass %>/**/*.scss',
				tasks: ['compass','copy:fonts']
			},
			js: {
				files: '<%= dirs.src.app %>/**/*.js',
				tasks: ['jshint','concat']
			},
			html: {
				files: '<%= dirs.webApp.html %>/**/*.html',
				tasks: [] // required to invoke live-reload
			}	
		},

		/**************************************************************

		JSHint the Javascript files
		***************************************************************
		*
		*
		* Runs JSHint on the app javascript files
		*
		*
		***************************************************************/
		jshint: {
			app: ['<%= dirs.src.app %>/**/*.js']
		},

		/**************************************************************

		Run a light-weight web server
		***************************************************************
		*
		***************************************************************/
		'http-server': {
			dev: {
				root: '<%= dirs.webApp.html %>',
				port: '8080',
				// run in parallel with other tasks
				runInBackground: true
			}
		}
	});

	// load NPM tasks
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
   	grunt.loadNpmTasks('grunt-contrib-jshint');
   	grunt.loadNpmTasks('grunt-contrib-uglify');
   	grunt.loadNpmTasks('grunt-contrib-watch');
   	grunt.loadNpmTasks('grunt-newer');
   	grunt.loadNpmTasks('grunt-http-server');

   	// custom tasks
   	grunt.registerTask('default', 'Default Output', function() {
    grunt.log.write('\n\n\n\n');
    grunt.log.write('========================================================================\n');
    grunt.log.write('====|  GRUNT TASKS  |===================================================\n');
    grunt.log.write('========================================================================\n');
    grunt.log.write('\n');
    grunt.log.write(' >   grunt bower:install	--> Install bower packages\n');
    grunt.log.write(' >   grunt develop		--> Watch source files & run web server\n');
    grunt.log.write('\n');
    grunt.log.write(' >   grunt compile		--> Generate sass, concat js, & copy to webApp\n');
    grunt.log.write(' >   grunt http-server		--> Deploy web server(port '+grunt.config.get("http-server.dev.port")+')\n');
    grunt.log.write(' >   grunt watch		--> Watch source files for modifications\n');
    grunt.log.write('\n');
    grunt.log.write('========================================================================\n');
    grunt.log.write('========================================================================\n');
    grunt.log.write('\n\n\n\n');
    });
	
	grunt.registerTask('compile', ['compass','copy','jshint','concat:appJS','concat:thirdPartyJS']);
	grunt.registerTask('develop', ['http-server','watch']);
};