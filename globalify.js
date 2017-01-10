var fs = require('fs');
    npm = require('npm'),
    path = require('path'),
    defaults = {
        externals: [],
        installDirectory: './globalify_modules'
    },
    rootPath = __dirname;
var pascalCase = require('pascal-case');
var sourceMapLoader = require('source-map-loader');
var webpack = require('webpack');

module.exports = function globalify(settings, callback){

    settings = settings || {};

    for(var key in defaults){
        settings[key] = settings[key] || defaults[key];
    }

    var moduleName = settings.module;
    var cleanedModuleName = moduleName.indexOf('@') === 0 ? moduleName.slice(1) : moduleName;
    var version = settings.version;
    var outputFileName = settings.outputFileName || cleanedModuleName.replace('/', '-') + (version ? '-' + version.replace(/\./g,'-') : '') + '.js';
    var globalVariable = settings.globalVariable || pascalCase(cleanedModuleName);
    var globalShim = {};
    for (var i = 0; i < settings.externals.length; i++) {
        var externalKeyAndValue = settings.externals[i].split('=');
        globalShim[externalKeyAndValue[0]] = externalKeyAndValue[1];
    }
    var context = path.resolve(rootPath, settings.installDirectory);
    var entry = path.resolve(context, 'node_modules', moduleName);
    function globalifyModule(moduleName, callback){
        webpack({
            externals: globalShim,
            devtool: 'inline-source-map',
            context,
            entry,
            output: {
                path: process.cwd(),
                filename: outputFileName,
                library: globalVariable,
                libraryTarget: 'var'
            },
            module: {
                loaders: [
                    {
                        test: /.\.js$/,
                        loader: 'source-map-loader'
                    }
                ]
            }
        }).run((err, stats) => {
            if (err || stats.hasErrors()) {
                console.log(stats.toJson())
            }
            else {
                console.log('no error')
            }
        })
    }

    function npmInstall(module, version, callback){
        var nameAndVersion = module + (version ? '@"' + version + '"' : '');
        npm.commands.install([nameAndVersion], function (error, data) {
            callback(error);
        });
    }

    function installModule(moduleName, version, callback){
        var installDirectory = path.resolve(rootPath, settings.installDirectory),
            packagePath = path.join(installDirectory, 'package.json'),
            indexJsPath = path.join(installDirectory, 'index.js');

        if(!fs.existsSync(installDirectory)){
            fs.mkdirSync(installDirectory);
        }

        npm.load({
                prefix: installDirectory
            },
            function(error) {
                if(!version || version === 'x.x.x'){
                    npmInstall(moduleName, null, callback);
                }else{
                    npmInstall(moduleName, version, callback);
                }
            }
        );
    }

    installModule(moduleName, version, function(error){
        if(error){
            callback(error);
            return;
        }
        globalifyModule(moduleName, callback);
    });
}
