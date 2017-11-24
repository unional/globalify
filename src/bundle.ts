// import fs = require('fs')
// import path = require('path')
require('source-map-loader');
import webpack = require('webpack');

// function getPackageMain(entry) {
//   const pjsonPath = path.resolve(entry, 'package.json')
//   const pjson = JSON.parse(fs.readFileSync(pjsonPath, 'utf8'))
//   return pjson.main || 'index.js'
// }

export function createBundle({
  globalShim,
  context,
  entry,
  outputFileName,
  globalIdentifier
  // packageName
 }) {
  // const packageMain = getPackageMain(entry)
  // let root: string
  webpack({
    externals: globalShim,
    devtool: 'inline-source-map',
    context,
    entry,
    output: {
      path: process.cwd(),
      filename: outputFileName,
      library: globalIdentifier
      // devtoolFallbackModuleFilenameTemplate: (info) => {
      //   console.log(info)
      // },
      // devtoolModuleFilenameTemplate: (info) => {
      // //   if (info.resourcePath.startsWith('webpack/bootstrap'))
      // //     return `webpack:///${info.resourcePath}`

      //   console.log(info)
      // //   // if (!root)
      // //   //   root = info.resourcePath.slice(0, info.resourcePath.lastIndexOf('/') + 1)

      // //   // waiting for https://github.com/webpack/webpack/issues/5754
      // //   // return `webpack:///${packageName}/${info.resourcePath.slice(root.length)}`
      // //   return `webpack:///${packageName}/${info.resourcePath}`
      // }
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /.\.js$/,
          loader: 'source-map-loader'
        }
      ]
    }
  }).run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(stats.toJson())
    }
  })
}
