var deref, generator, mapProperties;

require('handlebars');

mapProperties = require("json-schema-java-mapper-utils").mapProperties;

generator = {};

generator.template = require("../../tmpl/groovy-class.hbs");

generator.partials = {
  classMembers: require("../../tmpl/class-members-partial.hbs"),
  innerClass: require("../../tmpl/inner-class.hbs")
};

deref = require('deref')();

generator.parser = function(data) {
  var mapping, model, normSchema, parsed, parsedClass, result, schema, schemas, version, _base, _i, _len;
  mapping = {
    'string': "String",
    'boolean': "Boolean",
    'number': "BigDecimal",
    'integer': "Long",
    'array': "List",
    'object': "Map",
    'file': "InputStream"
  };
  parsed = [];
  schemas = data.schemas;
  if (data.extra) {
    data.extra["package"] = "" + data.extra["package"] + "." + data.version;
    if ((_base = data.extra).enableAnnotations == null) {
      _base.enableAnnotations = true;
    }
  }
  for (_i = 0, _len = schemas.length; _i < _len; _i++) {
    schema = schemas[_i];
    normSchema = deref(schema, schemas);
    model = {};
    parsedClass = mapProperties(normSchema, deref.refs, mapping);
    model.classMembers = parsedClass.classMembers;
    model.innerClasses = parsedClass.innerClasses;
    model.className = parsedClass.className;
    model.classDescription = parsedClass.classDescription;
    model.extra = data.extra;
    if (model.classMembers.length > 0) {
      result = {};
      version = data.version ? "" + data.version + "/" : "";
      result["" + version + model.className + ".groovy"] = model;
      parsed.push(result);
    } else {
      console.log("WARN: ----> " + model.className + ".groovy is too abstract to create a file using List or Map");
    }
  }
  return parsed;
};

module.exports = generator;
