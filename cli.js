console.log(222)

process.exit()



const isProd = process.env.NODE_ENV=='production' || process.argv.indexOf('--production')>=0

var path = require('path')
var ackSass = require('ack-sass')
var filePath = path.join(__dirname,'../','src','scss','styles.scss')
var outFilePath = path.join(__dirname,'../','www','assets','styles','styles.css')
 
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
  console.log('compiling production sass')
}else{
  console.log('compiling sass')
}
 
 
ackSass.compileFile(filePath, outFilePath, options)
.then(function(){
  console.log('compiling completed')
})
.catch(console.log.bind(console))