var DEPLOY = __dirname + "/pkg/",
    _path = require('path'),
	UglifyJS = require('uglify-js'),
	cleanCSS = require('clean-css'),
    fs = require('fs');

function include(files, transform) { 
    files = files.map ? files : [files];
    return files.map(function (file) {
        var str = fs.readFileSync(file, "utf-8") + "\n";
        return transform ? transform(str, file) : str;
    }).join('\n');
}

function collect(path, files, matches) {
    matches = matches || function (path) {
        return path.match(/\.js$/);
    };

    if (fs.statSync(path).isDirectory()) {
        fs.readdirSync(path).forEach(function (item) {
            collect(_path.join(path, item), files, matches);
        });
    } else if (matches(path)) {
        files.push(path);
    }
}

desc("runs jake build");
task('default', ['build'], function () {});

desc("clean");
task('clean', [], function () {
    var childProcess = require('child_process'),
        cmd = 'rm -rf ' + DEPLOY + ' && ' +
              'mkdir ' + DEPLOY;

    childProcess.exec(cmd, complete);
}, true);

desc("package everything for a release");
task('build', ['clean'], function () {
    var output = "",
        css = "",
		license = "",
		minified,
		version,
		versionText = "",
        plugins = [];

	console.log("Gathering Files...");
	// Retrieve the version information
	version = JSON.parse(include("JakeVersion"));
	version.build++;
	versionText = '/* VERSION: ' + version.major + '.' + version.minor + '.' + version.revision + '.' + version.build + '*/\n\n';
	
	// Retrieve our license information
	license = include("JakeLicense");
	license += versionText;
	
	// Gather our core JS files
    output = include("src/core.js");
    collect(__dirname + "/src/plugins", plugins);
    plugins.forEach(function (plugin) {
        output += include(plugin);
    });
	
	// Write our our JS files
    fs.writeFileSync(__dirname + "/pkg/bbui.js", license + output);
    fs.writeFileSync(__dirname + "/samples/bbui.js", license + output);

	// Grab our CSS information
	css = include("src/bbUI.css");
	fs.writeFileSync(__dirname + "/pkg/bbui.css", license + css);
    fs.writeFileSync(__dirname + "/samples/bbui.css", license + css);
	
	// Minify
	console.log("Minifying...");
	// First the JavaScript
	license = '/*! bbUI VERSION: ' + version.major + '.' + version.minor + '.' + version.revision + '.' + version.build + ' | github.com/blackberry/bbUI.js/blob/master/LICENSE !*/';
	minified = UglifyJS.minify(__dirname + "/pkg/bbui.js");
	fs.writeFileSync(__dirname + "/pkg/bbui-min.js", license + minified.code);
	// Then the CSS
	minified = cleanCSS.process(include(__dirname + "/pkg/bbui.css"));
	fs.writeFileSync(__dirname + "/pkg/bbui-min.css", license + minified);
	
	// Update our build version
	versionText = '{"major" : ' + version.major +',	"minor" : ' + version.minor +', "revision" : ' + version.revision + ', "build" : '+ version.build+'}';
	fs.writeFileSync("JakeVersion", versionText);

    console.log("Holy Chetara Batman, That was fast!");
});
