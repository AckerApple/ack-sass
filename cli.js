#!/usr/bin/env node

var args = process.argv.splice(2)
var rootPath = process.cwd()
var isProd = args.indexOf('--production')>1 || (process.env && process.env.NODE_ENV=='production')

var path = require('path')
var ackSass = require('ack-sass')
var filePath = path.join(rootPath,args[0])
var outFilePath = path.join(rootPath,args[1])
 
var sassJspm = require('sass-jspm-importer')
var options={
  importer:[sassJspm.importer],
  functions:[sassJspm.resolve_function('/lib/')]//for sass-jspm-importer
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