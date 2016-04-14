'use strict';
var generators = require('yeoman-generator'), 
  _ = require('lodash'),
  Promise = require('bluebird'),
  rp = require('request-promise'),
  semver = require('semver'),
  glob = Promise.promisify(require('glob')),
  GruntfileEditor = require('gruntfile-editor');

module.exports = generators.Base.extend({
  initializing : function() {
    // TODO the following line goes in generator-web-starter initializing context
    // this.options.parent.gruntDependencies = {};
    this.options.gruntDependencies = {};
    
    // TODO the following line goes in generator-web-starter-wordpress initializing context
    // this.options.parent.gruntDependencies['web-starter-grunt'] = {'compass' : {}, 'copy' : {}};
    this.options.gruntDependencies['web-starter-grunt'] = {'compass' : {}, 'copy' : {}};
  },

  writing : {
    settings : function() {
      var done = this.async();

      this.fs.copy(
          this.templatePath('Gruntfile.js'),
          this.destinationPath('Gruntfile.js')
      );
      
      var editor = new GruntfileEditor();
      // TODO 
      // this.options.parent.gruntDependencies
      _.forEach(this.options.gruntDependencies, function(value, key1) {
        _.forEach(value, function(value, gruntModule) {
          console.log(gruntModule);
          this.fs.copy(
              this.templatePath('tasks/config/' + gruntModule + '.js'),
              this.destinationPath('tasks/config/' + gruntModule + '.js')
          );
        });
      });
      done();
    }
  }
});