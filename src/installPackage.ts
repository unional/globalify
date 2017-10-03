import fs = require('fs')
import path = require('path')
import npm = require('npm')

import { rootPath } from './constants'

function npmInstall(module, version, callback) {
  let nameAndVersion = module + (version ? '@' + version : '');
  npm.commands.install([nameAndVersion], function (error) {
    callback(error);
  });
}
function teardownEnvironment(installDirectory) {
  const pjsonPath = path.resolve(installDirectory, 'package.json')
  const pjsonLockPath = path.resolve(installDirectory, 'package-lock.json')
  fs.unlinkSync(pjsonPath)
  fs.unlinkSync(pjsonLockPath)
}
function ensureEnvironmentReady(installDirectory) {
  if (!fs.existsSync(installDirectory)) {
    fs.mkdirSync(installDirectory);
  }
  const pjsonPath = path.resolve(installDirectory, 'package.json')
  if (!fs.existsSync(pjsonPath)) {
    fs.writeFileSync(pjsonPath, JSON.stringify({
      description: 'no description',
      repository: 'no repository',
      license: 'MIT'
    }), 'utf8')
  }
}
export function installPackage(packageName, version, settings, callback) {
  let installDirectory = path.resolve(rootPath, settings.installDirectory)

  ensureEnvironmentReady(installDirectory)

  function wrappedCallback(error) {
    teardownEnvironment(installDirectory)
    callback(error)
  }

  npm.load({
    prefix: installDirectory
  }, function () {
    if (!version || version === 'x.x.x') {
      npmInstall(packageName, null, wrappedCallback);
    }
    else {
      npmInstall(packageName, version, wrappedCallback);
    }
  });
}
