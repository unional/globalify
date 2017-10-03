import fs = require('fs')
import path = require('path')

export const pjson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'))
export const rootPath = __dirname;
