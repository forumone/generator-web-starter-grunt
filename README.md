generator-web-starter-grunt
===========================

Allows other yeoman generators to add grunt tasks.

## Usage

### Grunt task

In the 'configuring' yeoman generator context:

```js
this.options.getPlugin('grunt').addGruntTasks('postcss', this, 'theme1', {
  src: 'build/css/*.css'
});
```
will output in the 'tasks/config/postcss.js'
```js
  ...
  grunt.config.merge({
    postcss: {
      'theme1': { 'src': 'build/css/*.css' },
  ...
```

Note: the grunt task configuration object can be plain text too.

### Grunt dev dependency

```js
this.options.addDevDependency('grunt-postcss', '^0.8.0');
```
will output in 'package.json'
```js
  ...
  "devDependencies":
    ...
    "grunt-postcss": "^0.8.0"
    ...
```