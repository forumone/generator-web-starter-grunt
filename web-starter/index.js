'use strict';
var generators = require('yeoman-generator'), 
  _ = require('lodash'),
  Promise = require('bluebird'),
  rp = require('request-promise'),
  semver = require('semver'),
  glob = Promise.promisify(require('glob')),
  GruntfileEditor = require('gruntfile-editor');

var gruntTasks = {};

module.exports = generators.Base.extend({
  initializing : function() {
    var that = this;
    this.options.addPlugin("grunt", {
      getGruntTask : function(task) {
        if (!_.has(gruntTasks, task)) {
          gruntTasks[task] = new GruntfileEditor();
        }

        return gruntTasks[task];
      }
    });
  },
  writing : {
    gruntFile : function() {
      var done = this.async();
      this.fs.copyTpl(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js'),
        {}
      );

      done();
    },
    taskConfig : function() {
      var done = this.async();

      _.each(gruntTasks, function(editor, task) {
        this.fs.write('tasks/config/' + task + '.js', editor.toString());
      });

      done();
    }
  }
});
