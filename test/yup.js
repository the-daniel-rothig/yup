'use strict';
/*global describe, it */
var chai  = require('chai')
  , reach = require('../lib/util/reach')
  , number = require('../lib/number')
  , array = require('../lib/array')
  , bool = require('../lib/boolean')
  , object = require('../lib/object')
  , _ = require('../lib/util/_');


chai.should();

describe('Yup', function(){

  it('should export', function(){
    var yup = require('../lib')
  })

  it('should uniq', function(){
    _.uniq([1, 1, 2, 3, 4, 3], function(i){ return i})
      .should.eql([1, 2, 3, 4])

    _.uniq([{ a: 1}, { a: 2}, { a: 3}, { a: 1}], function(i){ return i.a})
      .should.deep.eql([{ a: 1}, { a: 2}, { a: 3}])
  })

  it('should merge', function(){
    var a = { a: 1, b: 'hello', c: [1,2,3], d: { a: /hi/ }, e: { b: 5} }

    var b = { a: 4, c: [4,5,3], d: { b: 'hello' }, f: { c: 5}, g: null }

    _.merge(a, b).should.deep.eql({ 
      a: 4, 
      b: 'hello', 
      c: [1,2,3, 4,5,3], 
      d: { 
        a: /hi/,
        b: 'hello'
      },
      e: { b: 5 },
      f: { c: 5 },
      g: null
    })
  })

  it('should REACH correctly', function(done){
    var num = number()
      , inst = object().shape({
        num: number().max(4),

        nested: object()
          .shape({ 
            arr: array().of(
              object().shape({ num: num })
            ) 
        })
      })

    reach(inst, 'nested.arr[].num').should.equal(num)
    reach(inst, 'nested.arr[1].num').should.equal(num)
    reach(inst, 'nested.arr[1].num').should.not.equal(number())

    reach(inst, 'nested.arr[].num').isValid(5, function(err, valid) {
      valid.should.equal(true)
      done()
    })
  })



  // it.only('should REACH with conditions', function(){
  //   var num = number()
  //   var altShape = { 
  //         next: object().shape({
  //           greet: bool(), 
  //           prop: number().when('greet', { is: true, then: number().max(5) })
  //         })
  //       }

  //   var inst = object().shape({
  //       num: number().max(4),
  //       nested: object()
  //         .when('num', { is: number().min(3), then: object(altShape) })
  //         .shape({ 
  //           next: object().shape({ prop: bool() })
  //         })
  //     })

  //   reach(inst, 'nested.arr[].num', { num: 1 }).should.equal(num)

  //   // reach(inst, 'nested.arr[1].num').should.equal(num)
  //   // reach(inst, 'nested.arr[1].num').should.not.equal(number())

  //   // reach(inst, 'nested.arr[].num').isValid(5, function(err, valid){
  //   //   valid.should.equal(true)
  //   //   done()
  //   // })
  // })
  
})