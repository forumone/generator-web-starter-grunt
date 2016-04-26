generator-web-starter-grunt
===========================

Allows other yeoman generators to add grunt tasks.

## Usage

### Grunt task

In the 'configuring' yeoman generator context:

```js
if(typeof this.options.getPlugin === "function" && this.options.getPlugin('grunt')) {
  this.options.getPlugin('grunt').addGruntTasks('postcss', 'grunt-postcss', 'theme1', {
    src: 'build/css/*.css'
  });
}
```
will output in the 'tasks/config/postcss.js'
```js
  ...
  grunt.config.merge({
    postcss: {
      'theme1': { 'src': 'build/css/*.css' },
  ...
  grunt.loadNpmTasks('grunt-postcss');
  ...
```

Note: the grunt task configuration object can be plain text too.


### Grunt dev dependency

```js
if(typeof this.options.addDevDependency === "function" && this.options.getPlugin('grunt')) {
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

Note: this functionality is provided by generator-web-starter