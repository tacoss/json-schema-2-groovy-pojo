'use strict';
var testRun = require("raml2code-fixtures").loadSchemasAndRun;
var generator = require('../lib/pojo');
var chai = require('chai');
var _ = require('lodash');
var should = chai.should();
var expect = require('chai').expect;
var data2Code = require('data2code');
var testUtils = require("raml2code-fixtures");

describe('should generate something', function () {

  it("should don't throw any excepcions", function(done) {
    var test = function(err, schemas, done){
      generator.handleRender = testUtils.handleRender.bind(undefined, done, "groovy/pogo/CatDTO.groovy", "v1/ComplexCat.groovy", false);
      var data = {
        schemas: schemas,
        version: "v1",
        extra: {package: "org.gex", enableAnnotations: false}
      };
      data2Code.process(data, generator);
      done();
    };
    testRun(test,done)

  });


  it("should generate a annotated POJO", function(done){
    var test = function(err, schemas, done){
      generator.handleRender = testUtils.handleRender.bind(undefined, done, "groovy/pogo/CatDTOJSR303.groovy", "v1/ComplexCat.groovy", false);
      var data = {
        schemas: schemas,
        version: "v1",
        extra: {package: "org.gex"}
      };
      data2Code.process(data, generator);
      done();
    };
    testUtils.loadSchemasAndRun(test,done);
  });

  it("should generate a POJO with inlineRef", function(done){
    var test = function(err, schemas, done){
      generator.handleRender = testUtils.handleRender.bind(undefined, done, "groovy/pogo/WidgetInline.groovy", "v1/WidgetSelfReference.groovy", false);
      var data = {
        schemas: schemas,
        version: "v1",
        extra: {package: "org.gex"}
      };
      data2Code.process(data, generator);
      done();
    };
    testUtils.loadSchemasAndRun(test,done);


  });

  it("should generate a POJO with property ref", function(done){
    var test = function(err, schemas, done){
      generator.handleRender = testUtils.handleRender.bind(undefined, done, "groovy/pogo/WidgetInlineProperty.groovy", "v1/WidgetInlineProperty.groovy", false);
      var data = {
        schemas: schemas,
        version: "v1",
        extra: {package: "org.gex"}
      };
      data2Code.process(data, generator);
      done();
    };
    testUtils.loadSchemasAndRun(test,done);

  });

});