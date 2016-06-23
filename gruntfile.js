module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		watch: {
			sass:{
				files: ['public/sass/**/*.scss'],
				tasks: ['sass', 'concat:css', 'cssmin']
			},
			js: {
				files: ['public/js/*.js'],
				tasks: ['concat:js']
			},
			react: {
                files: ['react/**/*.jsx'],
                tasks: ['browserify']
            }
		},
        browserify: {
            options: {
                debug: true 
            },
            js: {
                src: ['./public/scripts/buttons.js', './public/scripts/dropzone/dzone-customize.js'],
                dest: './public/scripts/bundle.js'
            }
        },		
		sass: {
			dist:{
				files: [{
					expand: true,
					cwd: 'public/sass',
					src: ['**/*.scss'],
					dest: 'public/css',
					ext: '.css'
				}]
			}
		},
		concat: {
			options: {
				separator: "\n",
				stripBanners: true,
				banner: '/*! <% pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			css: {
				src: ['public/css/*.css'],
				dest: 'public/css/build/combined.css'
			},
			js: {
				src: ['public/js/*.js'],
				dest: 'public/combined.min.js'
			},
		},
		uglify: {
			options: {
				manage: false,
			},
			my_target: {
				files: [{
					expand: true,
					cwd: 'public/scripts/js',
					src: ['*.js', '!*.min.js'],
					dest: 'public/scripts/js/',
					ext: '.min.js'
				}]
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'public/css/',
					src: ['*.css', '!*.min.css'],
					dest: 'public/css/',
					ext: '.min.css'
				}]
			}
		}				
	});

	// grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['watch']);

	// individual commands that can be executed from command line
	// type 'grunt <task alias name>'
	grunt.registerTask('react', ['browserify']);
	grunt.registerTask('sassBuild',['sass']);
	grunt.registerTask('minify',['cssmin']);
	grunt.registerTask('css', ['sass', 'concat:css', 'cssmin']);
	//grunt.registerTask('build', ['browserify', 'sass', 'concat', 'cssmin']);
	grunt.registerTask('build', ['browserify', 'sass', 'cssmin']);

};