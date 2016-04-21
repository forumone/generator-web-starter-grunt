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
      }
    });
  },
  writing : {
    settings : function() {
      var done = this.async();
      this.fs.copyTpl(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js'),
        {}
      );
      var that = this;
      _.forEach(gruntTasks, function(taskValue, task) {
        var gruntTaskFile = false;
        try {
          // if there is a file in tasks/config/ it uses that one , if not it uses the grunt-editor/lib/default-gruntfile.js
          gruntTaskFile = that.fs.read(taskValue.context.templatePath('tasks/config/' + task + '.js'));
        }
        catch (e) {
        }
        var editor = new GruntfileEditor(gruntTaskFile);
        var conf = "{";
        _.forEach(taskValue, function(targetConf, target) {
          if(target!=='context') {
            if(_.isObject(targetConf)) {
              targetConf = JSON.stringify(targetConf);
            }
            conf += '"' + target + '": ' + targetConf + ',';
          }
        });
        conf = conf.substring(0,conf.length-1);
        conf += "}";
        editor.insertConfig(task, conf);
        
        // add  grunt.loadNpmTasks("grunt-task-name") if doesn't exist
        if (editor.toString().indexOf('loadNpmTasks(') < 1) {
          editor.loadNpmTasks(task);
        }
        that.fs.write('tasks/config/' + task + '.js', editor.toString());
      });
      done();
    }
  }
});