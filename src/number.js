'use strict';
var SchemaObject = require('./mixed')
  , locale = require('./locale.js').number
  , { isDate, inherits } = require('./util/_');

module.exports = NumberSchema

function NumberSchema(){
  if ( !(this instanceof NumberSchema)) 
    return new NumberSchema()

  SchemaObject.call(this, { type: 'number' })

  this.transforms.push(function(value) {
    if ( this.isType(value) )  return value
    if ( typeof value === 'boolean' )  return value ? 1 : 0

    return isDate(value) ? +value : parseFloat(value)
  })
}

inherits(NumberSchema, SchemaObject, {

  _typeCheck(v) {
    return typeof v === 'number' && !(v !== +v)
  },

  min(min, msg) {
    return this.validation(
        { name: 'min', exclusive: true, params: { min: min }, message: msg || locale.min }
      , value => value == null || value >= min)
  },

  max(max, msg) {
    return this.validation(
        { name: 'max', exclusive: true, params: { max: max }, message: msg || locale.max }
      , value => value == null || value <= max)
  },

  positive(max, msg) {
    return this.min(0, msg || locale.positive)
  },

  negative(max, msg) {
    return this.max(0, msg || locale.negative)
  },

  integer(msg) {
    msg = msg || locale.integer

    return this
      .transform( v => v != null ? (v | 0) : v)
      .validation(msg, val => val === (val | 0))
  },

  round(method){
    var avail = ['ceil', 'floor', 'round']
    method = (method && method.toLowerCase()) || 'round'

    if( avail.indexOf(method.toLowerCase()) === -1 )
      throw new TypeError('Only valid options for round() are: ' + avail.join(', '))

    return this.transform(v => v != null ? Math[method](v) : v)
  }
})