// VARIABLES & PATHS
let preprocessor = 'sass', // Preprocessor (sass, scss, less, styl)
    fileswatch   = 'html,htm,txt,json,md,woff2,php', // List of files extensions for watching & hard reload (comma separated)
    pageversion  = 'html,htm,php', // List of files extensions for watching change version files (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    online       = true, // If «false» - Browsersync will work offline without internet connection
    basename     = require('path').basename(__dirname),
    forProd      = [
					'/**',
					' * @author Alexsab.ru',
					' */',
					''].join('\n');

const { src, dest, parallel, series, watch, task } = require('gulp'),
	sass           = require('gulp-sass'),
	cleancss       = require('gulp-clean-css'),
	concat         = require('gulp-concat'),
	browserSync    = require('browser-sync').create(),
	uglify         = require('gulp-uglify-es').default,
	autoprefixer   = require('gulp-autoprefixer'),
	imagemin       = require('gulp-imagemin'),
	newer          = require('gulp-newer'),
	rsync          = require('gulp-rsync'),
	del            = require('del'),
	connect        = require('gulp-connect-php'),
	header         = require('gulp-header'),
	notify         = require('gulp-notify'),
	rename         = require('gulp-rename'),
	responsive     = require('gulp-responsive'),
	pngquant       = require('imagemin-pngquant'),
	merge          = require('merge-stream'),
	// version        = require('gulp-version-number'),
	// revAll         = require('gulp-rev-all'),
	replace        = require('gulp-replace');

if(typeof projects == 'undefined') 
	global.projects = {};
if(typeof port == 'undefined') 
	global.port = 8100;


projects.punkt = {

	port: ++port,

	base: basename,
	dest: basename,

	styles: {
		src:    basename + '/src/' + preprocessor + '/**/*',
		//watch:  basename + '/src/' + preprocessor + '/**/*.'+preprocessor,
		dest:   basename + '/dist/css',
		output: 'main.min.css',
	},

	scripts: {
		src: [
			// 'node_modules/jquery/dist/jquery.min.js',
			basename + '/src/libs/jquery/jquery-2.2.4.min.js',
			basename + '/src/libs/lazyload/lazyload.js',
			basename + '/src/libs/Magnific-Popup-master/jquery.magnific-popup.js',
			'node_modules/slick-carousel/slick/slick.min.js',
			basename + '/src/libs/scrollmagic/uncompressed/plugins/TweenMax.min.js',
			basename + '/src/libs/scrollmagic/uncompressed/ScrollMagic.js',
			basename + '/src/libs/scrollmagic/uncompressed/plugins/animation.gsap.js',
			basename + '/src/libs/sweetalert.min.js',
			basename + '/src/js/map.js',
			basename + '/src/js/common.js',
		],
		dest:       basename + '/dist/js',
		output:     'scripts.min.js',
	},

	images: {
		src:  basename + '/src/img/**/*',
		dest: basename + '/dist/img',
	},

	code: {
		src: [
			basename  + '/**/*.{' + fileswatch + '}',
		],
	},
	forProd: [
		'/**',
		' * @author https://github.com/newstreetpunk',
		' * @editor https://github.com/alexsab',
		' */',
		''].join('\n'),
}


/* punkt BEGIN */

// Local Server
function punkt_browsersync() {
	connect.server({
		port: projects.punkt.port,
		base: projects.punkt.base,
	}, function (){
		browserSync.init({
			//server: { baseDir: projects.kia.base + '/' },
			proxy: '127.0.0.1:' + projects.punkt.port,
			notify: false,
			online: online
		});
	});
};

// Custom Styles
function punkt_styles() {
	return src(projects.punkt.styles.src)
	.pipe(eval(preprocessor)({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat(projects.punkt.styles.output))
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'] }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(dest(projects.punkt.styles.dest))
	.pipe(browserSync.stream())

};

// Scripts
function punkt_scripts() {
	return src(projects.punkt.scripts.src)
	.pipe(concat(projects.punkt.scripts.output))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(header(projects.punkt.forProd))
	.pipe(dest(projects.punkt.scripts.dest))
	.pipe(browserSync.stream())
};

function punkt_images() {
	return src(projects.punkt.images.src)
	.pipe(newer(projects.punkt.images.dest))
	.pipe(imagemin([
            pngquant(),            
        ],{
            verbose: true
        }))
	.pipe(dest(projects.punkt.images.dest))
}

function punkt_cleanimg() {
	return del('' + projects.punkt.images.dest + '/**/*', { force: true })
}

function punkt_watch() {
	watch(projects.punkt.styles.src, punkt_styles);
	watch(projects.punkt.scripts.src, punkt_scripts);
	// watch(projects.punkt.images.src, punkt_cleanimg);
	watch(projects.punkt.images.src, punkt_images);
	watch(projects.punkt.code.src).on('change', browserSync.reload);
};

exports.punkt_cleanimg = punkt_cleanimg;
exports.punkt = parallel(punkt_images, punkt_styles, punkt_scripts, punkt_browsersync, punkt_watch);

/* punkt END */