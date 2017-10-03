import path = require('path')
import pascalCase = require('pascal-case');

import { createBundle } from './bundle'
import { rootPath } from './constants'
import { defaultSettings } from './settings'
import { installPackage } from './installPackage'
export function globalify(settings, callback) {

  settings = settings || {};

  for (const key in defaultSettings) {
    settings[key] = settings[key] || defaultSettings[key];
  }

  const packageName = settings.module;
  const cleanedModuleName = packageName.indexOf('@') === 0 ? packageName.slice(1) : packageName;
  const version = settings.version;
  const outputFileName = settings.outputFileName || cleanedModuleName.replace('/', '-') + (version ? '-' + version.replace(/\./g, '-') : '') + '.js';

  const globalIdentifier = typeof settings.globalVariable === 'function' ?
    settings.globalVariable(packageName, version) :
    settings.globalVariable || pascalCase(cleanedModuleName);

  const globalShim = {};
  for (let i = 0; i < settings.externals.length; i++) {
    const externalKeyAndValue = settings.externals[i].split('=');
    globalShim[externalKeyAndValue[0]] = externalKeyAndValue[1];
  }
  const context = path.resolve(rootPath, settings.installDirectory);
  const entry = path.resolve(context, 'node_modules', packageName);

  installPackage(packageName, version, settings, function (error) {
    if (error) {
      callback(error);
      return;
    }
    const options = {
      globalShim,
      context,
      entry,
      outputFileName,
      globalIdentifier,
      packageName
    }
    createBundle(options);
  });
}
