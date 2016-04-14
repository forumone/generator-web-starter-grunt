'use strict';
var generators = require('yeoman-generator'), 
  _ = require('lodash'),
  Promise = require('bluebird'),
  rp = require('request-promise'),
  semver = require('semver'),
  glob = Promise.promisify(require('glob'));

module.exports = generators.Base.extend({
  writing : {
    settings : function() {
      var done = this.async();
      
      // Get current system config for this sub-generator
      var config = this.options.parent.answers['web-starter-grunt'];
      _.extend(config, this.options.parent.answers);

      this.fs.copyTpl(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js'),
        config
      );
      
      done();
    }
  }
});
