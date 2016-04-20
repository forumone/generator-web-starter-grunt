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
      addGruntTasks : function(task, pluginContext, target, config) {
        if (!gruntTasks.hasOwnProperty(task)) {
          gruntTasks[task] = {};
        }
        gruntTasks[task][target] = config;
        gruntTasks[task]['context'] = pluginContext;
      },
      addGruntDevDependency : function(dep) {
        var pf = that.options.parent.answers.package_file;
        if(pf.devDependencies.constructor !== Array) {
          pf.devDependencies = [pf.devDependencies];
        }
        pf.devDependencies.push(dep);
      }
    });
  },
  writing : {
    settings : function() {
      var done = this.async();
      this.fs.copy(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );
      var that = this;
      _.forEach(gruntTasks, function(taskValue, task) {
        var gruntTaskFile = that.fs.read(taskValue.context.templatePath('tasks/config/' + task + '.js'));
        var editor = new GruntfileEditor(gruntTaskFile);

        _.forEach(taskValue, function(targetConf, target) {
          if(target!=='context') {
            editor.insertConfig(target, JSON.stringify(targetConf));
          }
        });

        that.fs.write('tasks/config/' + task + '.js', editor.toString());
      });
      done();
    }
  }
});