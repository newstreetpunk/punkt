	punkt: {
		port: ++port,

		base: base.punkt,
		dest: base.punkt,

		styles: {
			src:    base.punkt + '/src/' + preprocessor + '/**/*',
			//watch:  base.punkt + '/src/' + preprocessor + '/**/*.'+preprocessor,
			dest:   base.punkt + '/dist/css',
			output: 'main.min.css',
		},

		scripts: {
			src: [
				// 'node_modules/jquery/dist/jquery.min.js',
				base.punkt + '/src/libs/jquery/jquery-2.2.4.min.js',
				base.punkt + '/src/libs/lazyload/lazyload.js',
				base.punkt + '/src/libs/Magnific-Popup-master/jquery.magnific-popup.js',
				base.punkt + '/src/libs/sweetalert.min.js',
				base.punkt + '/src/js/map.js',
				base.punkt + '/src/js/common.js',
			],
			dest:       base.punkt + '/dist/js',
			output:     'scripts.min.js',
		},

		images: {
			src:  base.punkt + '/src/img/**/*',
			dest: base.punkt + '/dist/img',
		},

		code: {
			src: [
				base.punkt  + '/**/*.{' + fileswatch + '}'
			],
		},
		forProd: [
			'/**',
			' * @author https://github.com/newstreetpunk',
			' * @editor https://github.com/alexsab',
			' */',
			''].join('\n'),
	},

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