'use strict';

var test = require('unit.js'),
    Model = require('./../lib/model');

describe('Model::setModel()', function() {

    var model = new Model();

    it('Must set Model::needPersist to false if the given model is not a mongoose model', function () {
        model.model = {};

        test.value(model.needPersist).isBoolean();
        test.value(model.needPersist).isFalse();
    });

    it('Must set Model::model', function () {
        let myModel = function model() {
            this.test = 'test';
        };
        model.model = myModel;

        test.value(model.model).isObject();
        test.object(model.model).hasProperty('test');
    });
});

describe('Model::Persist()', function () {
    
    var model = new Model();
    model = test.promise.promisifyAll(model);

    it('Must set Model::model members value according to the given data members value', function () {
        let data = {
            test: 'test',
            test2: 'test2',
            test3: 'test3'
        };
        let myModel = function model() {
            this.test = null;
            this.test2 = null;
            this.test3 = null;
        };

        model.model = myModel;
        test.promise
            .given(model.persistAsync(data))
            .then(function(err){
                test.value(model.model).isObject();
                test.object(model.model).hasProperties(['test', 'test2', 'test3']);
                test.object(model.model).hasValues(['test', 'test2', 'test3']);
            })
            .done();
    });
});