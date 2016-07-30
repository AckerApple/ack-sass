# ack-sass
A [node-sass](https://www.npmjs.com/package/node-sass) implementation that greatly reduces configuration setup and also comes with natural css file importing functionality

## Sass Include CSS Example

> Create File: styles.css

```
html,body {margin:0;padding:0;width:100%;height:100%;}
```

> Create File: styles.scss

```
@import "CSS:./some-css-file"/* never add .css extension */
html,body {margin:1em;padding:1em;}
```

## NodeJs Build Examples
The following example will compile a .scss file into a .css file

### Single File Build Example
> Create file: scss-single.js

```
var path = require('path')
var ackSass = require('ack-sass')
var filePath = path.join(__dirname,'styles.scss')
var outFilePath = path.join(__dirname,'styles.css')

console.log('compiling sass')

ackSass.compileFile(filePath, outFilePath)
.then(function(){
  console.log('compiling completed')
})
.catch(console.log.bind(console))
```

### Multi File Build Example
> Create file: scss.js

```
var path = require('path')
var ackSass = require('ack-sass')
var filePath = path.join(__dirname,'scss')
var outFilePath = path.join(__dirname,'css')

console.log('compiling sass path')

ackSass.compilePath(filePath, outFilePath)
.then(function(){
  console.log('compiling path completed')
})
.catch(console.log.bind(console))
```

## Create NPM Scripts
Using the above examples, create yourself a quick script

> Edit file: package.json
```
scripts:{
  "build:sass:single": "node scss-single",
  "build:sass": "node scss"
}
```

### Include JSPM
JSPM is crazy awesome as of this writing, you will most likely need to include css from JSPM packages

> Import [sass-jspm-importer](https://www.npmjs.com/package/sass-jspm-importer) into project

```
$ npm install --save-dev sass-jspm-importer
```

> Create File: scss.js (an edit of [previous example](#single-file-build-example))

```
var path = require('path')
var ackSass = require('ack-sass')
var filePath = path.join(__dirname,'styles.scss')
var outFilePath = path.join(__dirname,'styles.css')

var sassJspm = require('sass-jspm-importer')
var options={
  importer:[sassJspm.importer],
  functions:[sassJspm.resolve_function('/lib/')]//for sass-jspm-importer
}

console.log('compiling sass')

ackSass.compileFile(filePath, outFilePath, options)
.then(function(){
  console.log('compiling completed')
})
.catch(console.log.bind(console))
```