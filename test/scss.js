var path = require('path')
var ackSass = require('../index')
var filePath = path.join(__dirname,'styles.scss')
var outFilePath = path.join(__dirname,'compiled-tests','styles.css')

console.log('compiling sass')

ackSass.compileFile(filePath, outFilePath)
.then(function(){
  console.log('compiling completed')
})
.catch(e=>console.log(e))
