'use strict';
var generators = require('yeoman-generator'), 
  _ = require('lodash'),
  Promise = require('bluebird'),
  rp = require('request-promise'),
  semver = require('semver'),
  glob = Promise.promisify(require('glob')),
  GruntfileEditor = require('gruntfile-editor');

var gruntTasks = {};
var registeredTasks = {};

module.exports = generators.Base.extend({
  initializing : function() {
    var that = this;
    this.options.addPlugin("grunt", {
      getGruntTask : function(task) {
        if (!_.has(gruntTasks, task)) {
          gruntTasks[task] = new GruntfileEditor();
        }

        return gruntTasks[task];
      },
      registerTask : function(name, task, priority) {
        if (!_.has(registeredTasks, name)) {
          registeredTasks[name] = [];
        }
        
        // Allow multiple tasks to be added at once
        if (_.isArray(task)) {
          registeredTasks[name] = registeredTasks[name].concat(task);
        }
        else {
          registeredTasks[name].push({ task : task, priority : priority });
        }
      }
    });
  },
  configuring : {
    addDefautTasks : function() {
      this.options.addDevDependency('grunt', '^0.4.5');
      this.options.addDevDependency('include-all', '^0.1.6');
      this.options.addDevDependency('load-grunt-tasks', '^3.2.0');
    },
  },
  writing : {
    writeGruntFile : function() {
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
      var that = this;

      _.each(gruntTasks, function(editor, task) {
        that.fs.write(that.destinationPath('tasks/config/' + task + '.js'), editor.toString());
      });

      done();
    },
    registeredTasks : function() {
      var done = this.async();
      var that = this;
      
      console.log(registeredTasks);
      _.each(registeredTasks, function(tasks, name) {
        var editor = new GruntfileEditor();
        var sorted = _.chain(tasks)
          .sortBy(['priority'])
          .map(function(task) {
            return task.task;
          })
          .value();
        
        editor.registerTask(name, sorted);
        that.fs.write(that.destinationPath('tasks/register/' + name + '.js'), editor.toString());
      });
      
      done();
    }
  }
});
