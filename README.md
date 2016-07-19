# ack-sass
node-sass implementation that greatly reduces configuration setup and also comes with css file importer

## Example
> Create file: scss.js
```
var path = require('path')
var ackSass = require('./ack-sass')
var filePath = path.join(__dirname,'src','scss','style.scss')
var outFilePath = path.join(__dirname,'www','assets','styles','styles.css')

console.log('compiling sass')

ackSass.compileFile(filePath, outFilePath)
.then(function(){
  console.log('compiling completed')
})
```

### Create NPM Script
Using the above example file scss.js, create yourself a quick script
> package.json
```
scripts:{
  "build:sass": "node scss"
}
```