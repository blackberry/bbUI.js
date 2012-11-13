var DEPLOY = __dirname + "/pkg/",
    _path = require('path'),
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
        plugins = [];

    output += include("JakeLicense");
    output += include("src/core.js");

    collect(__dirname + "/src/plugins", plugins);

    plugins.forEach(function (plugin) {
        output += include(plugin);
    });

    fs.writeFileSync(__dirname + "/pkg/bbui-0.9.5.js", output);
    fs.writeFileSync(__dirname + "/samples/bbui-0.9.5.js", output);

    css += include("src/bbUI.css");
    fs.writeFileSync(__dirname + "/pkg/bbui-0.9.5.css", css);
    fs.writeFileSync(__dirname + "/samples/bbui-0.9.5.css", css);

    console.log("Prepare ship for ludicrous speed!");
});
