"use strict";

module.exports.compileFile = compileFile

var ack = require('ack-node')
var sass = require('node-sass')
var fs = require('fs')
var sassCss = require('node-sass-css-importer')
var path = require('path')

var packJsonPath = require.resolve('./package.json')
var packJsonPathArray = packJsonPath.split(/(\/|\\)/g)
packJsonPathArray.pop()//remove package.json filename

var packPathing = []
packPathing.push.apply(packPathing, packJsonPathArray)
packPathing.pop()//remove slash
var packName = packPathing.pop()//package folder name

var nodeModulesPath = path.join(packJsonPath, '../', '../')
//var nodeModulesPath = path.join(packJsonPath, '../', 'node_modules')
//var nodeModulesPath = packName=='ack-sass' ? path.join(packJsonPath,'node_modules') : path.join(packJsonPath,'node_modules')

/** returns Promise with result Object{map,css}
  @options - read options listed for render() function at https://www.npmjs.com/package/node-sass
*/
function compileFile(filePath, outFilePath, options){
  var res,rej,outResult, nodeModsPath = nodeModulesPath

  //Allow includde of raw css files
  var CssImporter = sassCss({
    import_paths: [nodeModsPath]
  })

  options = options || {}

  if(options.importer){
    if(!options.importer.join){//its not an array already
      options.importer = [options.importer]
    }
  }else{
    options.importer = []
  }
  options.importer.unshift(CssImporter)

  if(options.includesPath){
    if(!options.includesPath.split){//its not an array already
      options.includesPath = [options.includesPath]
    }
  }else{
    options.includesPath = []
  }
  options.includesPath.unshift(nodeModsPath)

  options.file = options.file || filePath
  options.outputStyle = options.outputStyle || 'compressed'
  options.outFile = options.outFile || outFilePath.split(/(\\|\/)/).pop()//fileName for map reference
  options.sourceMap = options.sourceMap==null ? true : options.sourceMap

  function writeFile(err, result){
    if(err)return rej(err)
    outResult = result
    fs.writeFile(outFilePath, result.css, writeMap)
  }

  function endProcess(err){
    if(err)return rej(err)
    res(outResult)
  }

  function writeMap(err){
    if(err)return rej(err)
    fs.writeFile(outFilePath+'.map', outResult.map, endProcess)
  }

  return new Promise(function(response, reject){
    res=response
    rej=reject
    sass.render(options, writeFile)
  })
}

function pathRepeater(path, outPath, searchOps){
  return function(File){
    var rx = new RegExp('^'+path, 'i')
    var addOn = ack.path(File.path).removeFileName().path.replace(rx,'')
    var outFilePath = outPath+addOn+File.getFileName()
    return compileFile(File.path, outFilePath, searchOps)
  }
}

/** returns Promise with result Object{map,css}
  @options - read options listed for render() function at https://www.npmjs.com/package/node-sass
*/
function compilePath(path, outPath, options){
  var filter || ['**/**.scss']
  return ack.path(path).recurFilePath(pathRepeater(path, outPath, searchOps))
}