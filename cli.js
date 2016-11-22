#!/usr/bin/env node

var args = process.argv.splice(2)
var rootPath = process.cwd()
var isProd = args.indexOf('--production')>1 || (process.env && process.env.NODE_ENV=='production')
var isJspm = args.indexOf('--sass-jspm-importer')>1
var path = require('path')
var ackSass = require('ack-sass')
var filePath = path.join(rootPath,args[0])
var outFilePath = path.join(rootPath,args[1])
 
var options={}

if(isJspm){
  var sassJspm = require('sass-jspm-importer')
  options.importer = [sassJspm.importer]
  options.functions = [sassJspm.resolve_function('/lib/')]//for sass-jspm-importer
}else{
  console.log('\x1b[36m[ack-sass]\x1b[0m: Skipping JSPM support. --sass-jspm-importer flag not found')
  console.log('\x1b[36m[ack-sass]\x1b[0m: If JSPM needed: #1 npm install sass-jspm-importer')
}

if(isProd && !options.sourceMap){
  options.outputStyle = 'compressed'
  options.sourceComments = false
  options.sourceMapContents = false
  options.omitSourceMapUrl = true
  options.sourceMap = false
  options.sourceMapEmbed = false
  console.log('\x1b[36m[ack-sass]\x1b[0m: compiling production sass')
}else{
  console.log('\x1b[36m[ack-sass]\x1b[0m: compiling sass')
}
  
ackSass.compileFile(filePath, outFilePath, options)
.then(function(){
  console.log('\x1b[36m[ack-sass]\x1b[0m: compiling completed')
})
.catch(console.log.bind(console))