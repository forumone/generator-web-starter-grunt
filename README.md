generator-web-starter-grunt
===========================

Allows other yeoman generators to add grunt tasks.

## Usage

### Grunt task

In the 'configuring' yeoman generator context:

```js
if (typeof this.options.getPlugin === "function" && this.options.getPlugin('grunt')) {
  var editor = this.options.getPlugin('grunt').getGruntTask('postcss');
  editorinsertConfig('postcss.theme', '{ src : "build/css/*.css" }');
  editor.loadNpmTasks('grunt-contrib-postcss');
}
```
will output in the 'tasks/config/postcss.js'
```js
  ...
  grunt.loadNpmTasks('grunt-postcss');
  grunt.config.merge({
    postcss: {
      'theme1': { 'src': 'build/css/*.css' },
  ...
```

All other functions available on the [Gruntfile Editor](https://github.com/forumone/gruntfile-editor) can be used as well.

You also need to ensure that the appropriate package has been added to the project.

### Adding NPM package

```js
if (typeof this.options.addDevDependency === "function" && this.options.getPlugin('grunt')) {
  this.options.addDevDependency('grunt-postcss', '^0.8.0');
}
```
will output in 'package.json'
```js
  ...
  "devDependencies":
    ...
    "grunt-postcss": "^0.8.0"
    ...
```

Note: this functionality is provided by main [Yeoman generator](https://github.com/forumone/generator-web-starter)
