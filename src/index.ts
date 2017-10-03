#!/usr/bin/env node
import program = require('commander')
import { globalify } from './globalify'

import { parsePackageArgument } from './parsePackageArgument'
import { pjson } from './constants'

program
  .version(pjson.version)
  .usage('<package> [options]')
  .arguments('<package>')
  .option('-o, --out <outputFileName>', 'the output path')
  .option('-g, --globalVariable [globalVariable]', 'the name of the global variable to expose')
  .option('-e, --external <packageName>=<globalVariable>,...', 'the maps of dependencies to their global variables ')
  .parse(process.argv);

if (program.args.length !== 1) {
  program.help();
}

let externals
if (program.external) {
  externals = program.external.match(/[^,=]*=[^,]*/g)
  if (externals.length === 0) {
    program.help()
  }
}

const { packageName, version } = parsePackageArgument(program.args[0])

globalify({
  module: packageName,
  version: version,
  globalVariable: program.globalVariable,
  outputFileName: program.out,
  externals: externals,
  installDirectory: pjson.installDirectory
},
  function (error) {
    if (error) {
      console.error(error);
    }
  }
)
