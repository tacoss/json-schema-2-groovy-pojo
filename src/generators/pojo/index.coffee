#Handlebars must be required in node to support require('x.hbs').
require('handlebars')
mapProperties = require("json-schema-java-mapper-utils").mapProperties

generator = {}
#generator.helpers = commonHelpers
generator.template = require("../../tmpl/groovy-class.hbs")
generator.partials = {
  classMembers : require("../../tmpl/class-members-partial.hbs"),
  innerClass : require("../../tmpl/inner-class.hbs")
}

deref = require('deref')();

generator.parser = (data) ->
  mapping =
    'string' : "String"
    'boolean' : "Boolean"
    'number' : "BigDecimal"
    'integer' : "Long"
    'array' : "List"
    'object' : "Map"
    'file' : "InputStream"

  parsed = []
  schemas = data.schemas

  if data.extra
    data.extra.package = "#{data.extra.package}.#{data.version}"
    data.extra.enableAnnotations ?= true

  for schema in schemas
#   normSchema = deref(schema, schemas, true)  #Expanded
    normSchema = deref(schema, schemas) 

    model = {}
    parsedClass = mapProperties(normSchema, deref.refs, mapping)

    model.classMembers = parsedClass.classMembers
    model.innerClasses = parsedClass.innerClasses
    model.className = parsedClass.className
    model.classDescription = parsedClass.classDescription

    model.extra = data.extra
    if model.classMembers.length > 0
      result = {}
      version =  if data.version then "#{data.version}/"  else ""
      result["#{version}#{model.className}.groovy"] = model
      parsed.push result
    else
      #if there is not properties it must be a Map maps are not created
      console.log "WARN: ----> #{model.className}.groovy is too abstract to create a file using List or Map"

  parsed

module.exports = generator



