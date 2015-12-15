module.exports = function (grunt) {

    'use strict';

    // 작업시간 표시
    require('time-grunt')(grunt);

    // 자동으로 grunt 태스크를 로드합니다. grunt.loadNpmTasks 를 생략한다.
    // require('load-grunt-tasks')(grunt);
    require('jit-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: {
                files: [{
                    dot: true,
                    nonull: true,
                    src: ['dest']
                }]
            },
        },

        // html 에서 인클루드를 사용합니다.
        includes: {
            dist: {
                expand: true,
                cwd: 'src/docs/html/',
                src: ['**/*.html'],
                dest: 'dest',
                options: {
                    flatten: true,
                    // debug: true,
                    includePath: 'src/docs/include/'
                }
            }
        },
        // html 구문검사를 합니다.
        htmlhint: {
            options: {
                htmlhintrc: 'grunt/.htmlhintrc'
            },
            dist: [
                'dest/**/*.html',
                // 'src/docs/html/**/*.html',
                // '!src/docs/include/**/*.html'
            ]
        },

        less: {
            dist: {
                options: {
                    // banner: '<%= banner %>',
                    dumpLineNumbers : 'comments'
                },
                src: 'src/less/style.less',
                dest: 'dest/css/style.css'
            },
        },
        // css 구문검사를 합니다.
        csslint: {
            options: {
                csslintrc: 'grunt/.csslintrc'
            },
            dist: {
                expand: true,
                cwd: 'dest/css',
                src: ['*.css'],
                dest: 'dest/css',
                ext: '.css'
            }
        },
        // css 의 속성을 정렬해줍니다.
        csscomb: {
            options: {
                config: 'grunt/.csscomb.json'
            },
            dist: {
                expand: true,
                cwd: 'dest/css',
                src: ['*.css'],
                dest: 'dest/css',
                ext: '.css'
            }
        },
        // css 를 압축합니다.
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                noAdvanced: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dest/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dest/css',
                    ext: '.min.css'
                }]
            }
        },

        // 자바스크립트 구문검사를 합니다.
        jshint: {
            options: {
                jshintrc: 'grunt/.jshintrc',
                // force: true, // error 검출시 task를 fail 시키지 않고 계속 진단
                reporter: require('jshint-stylish') // output을 수정 할 수 있는 옵션
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            dist: {
                src: 'src/js/site/*.js'
            }
        },

        concat: {
            options: {
                separator: ';'
            //     banner: '<%= banner %>'
            },
            dist: {
                src: 'src/js/site/*.js',
                dest: 'dest/js/site.js'
            }
        },

        uglify: {
            options: {
            //     banner: '<%= banner %>'
            //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                src: 'dest/js/site.js',
                dest: 'dest/js/site.min.js'
            }
        },

        watch: {
            options: { livereload: true },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:grunt'],
            },
            html: {
                files: ['src/docs/**/*.html'],
                tasks: ['includes','htmlhint'],
            },
            less: {
                files: ['src/less/**/*.less'],
                tasks: ['less','postcss','csslint','csscomb','cssmin'],
            },
            jsnt: {
                files: ['src/js/**/*.js'],
                tasks: ['jshint','concat','uglify'],
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    livereload: 35729,
                    // keepalive: true,
                    base: 'dest',
                    open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/category1/page-01.html'
                }
            }
        },

    });

    // 작업을 로드합니다.
    // grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('serve', function (target) {
      if (target === 'dist') {
          return grunt.task.run(['connect', 'watch']);
      }

      grunt.task.run([
        'default',
        'connect',
        'watch'
      ]);

    });

    // html task
    grunt.registerTask('html', [
            'includes',
            'htmlhint'
        ]
    );

    grunt.registerTask('css', [
            // 'clean',
            'less',
            'postcss',
            'csslint',
            'csscomb',
            'cssmin'
        ]
    );

    // javascript task
    grunt.registerTask('jsnt', [
            'jshint',
            'concat',
            'uglify'
        ]
    );

    grunt.registerTask('default', [
        'clean',
        'html',
        'css',
        'jsnt',
    ]);


};
