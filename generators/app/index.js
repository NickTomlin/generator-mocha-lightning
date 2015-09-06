'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the unreal ' + chalk.red('MochaLightning') + ' generator!'
    ));

    var prompts = [
      {
        type: 'confirm',
        name: 'babel',
        message: 'Are you using babel?',
        default: true
      },
      {
        type: 'confirm',
        name: 'promises',
        message: 'Are you using promises?',
        default: true
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('mocha.opts'),
        this.destinationPath('test/mocha.opts'),
        {props: this.props}
      );

      this.fs.copyTpl(
        this.templatePath('helpers.js'),
        this.destinationPath('test/helpers.js'),
        {props: this.props}
      );

      var pack = this.fs.readJSON('package.json');
      if (!pack) {
        pack = {};
      }

      if (!pack.devDependencies) {
        pack.devDependencies = {};
      }

      pack.devDependencies.chai = '^3.2.0';
      pack.devDependencies.mocha = '^2.3.0';
      pack.devDependencies.sinon = '^1.16.1';

      if (this.props.promises) {
        pack.devDependencies['chai-as-promised'] = '^5.1.0';
      }

      this.fs.writeJSON('package.json', pack);
    }
  },

  install: function () {
    this.installDependencies();
  }
});
