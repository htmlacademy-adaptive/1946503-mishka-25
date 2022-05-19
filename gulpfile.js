import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(postcss([
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
  }


// Scripts

const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(gulp.dest('build/js'))
  .pipe(rename('script.min.js'))
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
  }


// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
  }

  const copyImages = () => {
    return gulp.src('source/img/**/*.{png,jpg,webp}')
    .pipe(gulp.dest('build/img'))
  }

// WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh({
  webp: {}
  }))
  .pipe(gulp.dest('build/img'))
  }

// SVG

const svg = () =>
gulp.src('source/img/*.svg')
.pipe(svgo())
.pipe(gulp.dest('build/img'));

const sprite = () => {
return gulp.src('source/img/*.svg')
.pipe(svgo())
.pipe(
  svgstore({
inlineSvg: true,
})
)
.pipe(rename('sprite.svg'))
.pipe(gulp.dest('build/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  ], {
  base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
  }

// Clean

const clean = () => {
  return del('build');
  };

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build',
      serveStaticOptions: {
        extensions: ["html"],
      },
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
  }

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  svg,
  gulp.parallel(
  styles,
  html,
  scripts,
  sprite,
  createWebp
  ),
  );

  // Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  svg,
  gulp.parallel(
  styles,
  html,
  scripts,
  sprite,
  ),
  gulp.series(
  server,
  watcher
  ));