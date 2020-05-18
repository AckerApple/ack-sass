"use strict";

module.exports.compileFile = compileFile
module.exports.compilePath = compilePath
module.exports.watchFile = watchFile
module.exports.watchPath = watchPath

var log = require('./log.function')
var grapher = require('sass-graph')
var watch = require('watch')
var ackPath = require('ack-path')
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
  var res, rej, outResult, nodeModsPath = nodeModulesPath

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

  if(options.includePaths){
    if(!options.includePaths.split){//its not an array already
      options.includePaths = [options.includePaths]
    }
  }else{
    options.includePaths = []
  }
  options.includePaths.unshift(nodeModsPath)

  options.file = filePath || options.file
  options.outputStyle = options.outputStyle || 'compressed'
  options.outFile = options.outFile || outFilePath.split(/(\\|\/)/).pop()//fileName for map reference
  options.sourceMap = options.sourceMap==null ? true : options.sourceMap

  function writeFile(err, result){
    if(err)return rej(err)
    outResult = result
    return ackPath.default(outFilePath).removeFileName().paramDir()
    .then(()=>{
      fs.writeFile(outFilePath, result.css, writeMap)
    })
    .catch( rej )
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

function pathRepeater(pathTo, outPath, options){
  return function(File,p){
    var rx = new RegExp('^'+pathTo, 'i')
    var addOn = ackPath.default(File.path).removeFileName().path.replace(rx,'')
    var outFilePath = path.join(outPath, addOn, File.Join().removeExt().getName()+'.css')

    return compileFile(File.path, outFilePath, options)
    .catch(e=>log.error(e))
  }
}

/** returns Promise with result Object{map,css}
  @options - read options listed for render() function at https://www.npmjs.com/package/node-sass
*/
function compilePath(path, outPath, options){
  var filter = ['**/**.scss','**.scss']
  var repeater = pathRepeater(path, outPath, options)
  return ackPath.default(path).recurFilePath(repeater, {filter:filter})
}

function watchPath(path, outPath, options){
  var outPathLower = outPath.toLowerCase()

  function callback(){
    log('path change detected', getServerTime())
    compilePath(path, outPath, options)
  }

  var graph = grapher.parseDir(path, options)
  var importMatches = getFilterByGraph(graph)
  options = options || {}
  options.filter = function(pathTo, stat){
    return (filterMaker(pathTo,stat) || importMatches(pathTo, stat)) && pathTo.toLowerCase().substring(0, outPathLower.length) != outPathLower
  }

  return createPathWatcher(path, callback, options)
}

function watchFile(filePath, outFilePath, options){
  var folderPath = path.join(filePath,'../')
  var filePathLower = filePath.toLowerCase()
  //var fileName = filePath.split( path.sep ).pop()

  function callback(){
    log('file change detected', getServerTime())
    compileFile(filePath, outFilePath, options)
  }
  
  var graph = grapher.parseFile(filePath, options)
  var importMatches = getFilterByGraph(graph)

  options = options || {}
  options.filter = function(pathTo, stat){
    return pathTo.toLowerCase() == filePathLower || importMatches(pathTo, stat)
  }

  return createPathWatcher(folderPath, callback, options)
}

function getFilterByGraph(graph){
  return function (pathTo, stat){
    if(stat.isDirectory()){
      for(var key in graph.index){
        if(key.substring(0, pathTo.length)==pathTo){
          return true
        }
      }
    }

    for(var key in graph.index){
      if(key==pathTo){
        log('watching',pathTo)
        return true
      }
    }
  }
}


function createPathWatcher(pathTo, reloader, options){
  options = options || {}
  options.filter = options.filter || filterMaker('scss','css','sass')

  return watch.createMonitor(pathTo, options, function (monitor) {
    monitor.on("created", reloader)
    monitor.on("changed", reloader)
    monitor.on("removed", reloader)
  })
}

function filterMaker(){
  var argPipes = 'scss|sass|css'

  if(arguments.length){
    argPipes = Array.prototype.slice.call(arguments).join('|')
  }
  var regx = new RegExp('\\.('+argPipes+')$')

  return function(pathTo, stat){
    return stat.isDirectory() || pathTo.search(regx)>=0
  }
}

function getServerTime(d){
  d = d || new Date()
  var h=d.getHours(),t='AM',m=d.getMinutes();m=m<10?'0'+m:m;h=h>=12?(t='PM',h-12||12):h==0?12:h;return ('0'+h).slice(-2)+':'+m+':'+d.getSeconds()+':'+d.getMilliseconds()+' '+t
}