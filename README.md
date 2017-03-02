# ack-sass
A [node-sass](https://www.npmjs.com/package/node-sass) implementation that greatly reduces configuration setup and also comes with natural css file importing functionality

### Table of Contents
- [Examples](#examples)
  - [Sass Include CSS Example](#sass-include-css-example)
  - [Single File Build Example](#single-file-build-example)
  - [Multi File Build Example](#multi-file-build-example)
  - [Single File Watch Example](#single-file-watch-example)
  - [Multi File Watch Example](#multi-file-watch-example)
- [Create NPM Scripts](#create-npm-scripts)
- [Include JSPM](#include-jspm)
- [Command Line Interface](#command-line-interface)

## Examples

### Sass Include CSS Example

> Create File: styles.css

```
html,body {margin:0;padding:0;width:100%;height:100%;}
```

> Create File: styles.scss

```
@import "CSS:./some-css-file"/* never add .css extension */
html,body {margin:1em;padding:1em;}
```

### Single File Build Example
> Create file: scss-build.js

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
> Create file: scss-build-path.js

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

### Single File Watch Example
> Create file: scss-watch-single.js

```
var path = require('path')
var ackSass = require('ack-sass')
var filePath = path.join(__dirname,'styles.scss')
var outFilePath = path.join(__dirname,'styles.css')

console.log('compiling sass')

ackSass.watchFile(filePath, outFilePath)
.then(function(){
  console.log('watching is occurring')
})
.catch(console.log.bind(console))
```

### Multi File Build Example
> Create file: scss-watch-path.js

```
var path = require('path')
var ackSass = require('ack-sass')
var filePath = path.join(__dirname,'scss')
var outFilePath = path.join(__dirname,'css')

console.log('compiling sass path')

ackSass.watchPath(filePath, outFilePath)
.then(function(){
  console.log('watching path is occuring')
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

## Command Line Interface
CLI, The following command will compile one scss file into one css file

Build File
```
ack-sass src/styles.scss www/assets/styles/styles.css --production
```

Build Folder
```
ack-sass src/ www/assets/styles/ --directory
```

Watch File
```
ack-sass src/styles.scss www/assets/styles/styles.css --watch
```

Watch Folder
```
ack-sass src/ www/assets/styles/ --watch --directory
```

### CLI Options

- watch
  - watches all files within import (except CSS:include)
  - watches all scss, sass, and css files within target folder
  - does not watch "CSS:include" files that are included OUTSIDE of building folder
- production
  - minify files
- directory
  - mode is to build entire folder instead of a single file

> Recommended to include the following in your package.json scripts
```
"scripts":{
  "build:css": "ack-sass src/styles.scss www/assets/styles/styles.css --production",
  "watch:css": "watch 'ack-sass src/styles.scss www/assets/styles/styles.css' src/scss"
}
```
