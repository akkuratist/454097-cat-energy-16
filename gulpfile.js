"use strict";

var gulp = require("gulp");
var del = require("del");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var htmlmin = require("gulp-htmlmin");
var include = require("posthtml-include");
var server = require("browser-sync").create();
var jsminify = require("gulp-uglify");

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/js/**",
    "source/*.ico"
  ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/_icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin())
    .pipe(gulp.dest("build"));
});

gulp.task("jsminify", function () {
  return gulp.src("source/js/*.js")
    .pipe(jsminify())
    .pipe(gulp.dest("build/js"));
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "images",
  "webp",
  "sprite",
  "html",
  "jsminify"
));

gulp.task("server", function () {
  server.init({
    server: "build/"
  });

  gulp.task("refresh", function (done) {
    server.reload();
    done();
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/img/-icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("html", "jsminify", "refresh"));
});

gulp.task("start", gulp.series("build", "server"));
