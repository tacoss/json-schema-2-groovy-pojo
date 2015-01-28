'use strict';
var generator = require('../lib/generators/pojo');
var Glob = require("glob");
var chai = require('chai');
var _ = require('lodash');
var should = chai.should();
var expect = require('chai').expect;
var data2Code = require('data2code');
var path = require('path');

var fs = require('fs');
var globOptions = {};

var readFiles = function(fn, done){
  return  function (err, files) {
    try{
      var schemas = _.map(files, function (file) {
        return JSON.parse(fs.readFileSync(file).toString('utf8'));
      });
      fn(err, schemas, done);
    }catch (e){
      done(e);
    }
  };
};



describe('should generate something', function () {

  var handleRender = function (done, sampleFile, validateWith, logContent,  results) {

    var sampleFileFs = path.join(__dirname, "./fixtures/sample/" + sampleFile);
    var exampleContents = fs.readFileSync(sampleFileFs);
    exampleContents = exampleContents.toString('utf8').split('\n');
    try {

      var validateWithContent = _.find(results, function(arr){
          return arr[validateWith] !== undefined
      });

      if(logContent){
        console.log("=================" + validateWith + "================")
        console.log(validateWithContent[validateWith]);
        console.log("==================================================")
      }

      validateWithContent[validateWith].split('\n').forEach(function (e, i) {
        e.trim().should.equal(exampleContents[i].trim(), "In line " + i + " " + sampleFile + " " + validateWith);
      });

      done();
    } catch (x) {
      done(x);
    }
  };

  it("should don't throw any excepcions", function(done) {
    var test = function(err, schemas, done){
      generator.handleRender = handleRender.bind(undefined, done, "CatDTO.groovy", "v1/Cat.groovy", false);
      var data = {
        schemas: schemas,
        version: "v1",
        extra: {package: "org.gex"}
      };
      data2Code.process(data, generator);
    };
    new Glob("**/*schema.json", globOptions, readFiles(test, done));

  });

})