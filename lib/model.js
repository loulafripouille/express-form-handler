'use strict';

var requiredir = require("require-dir"),
    adapters = requiredir('./adapters');

/**
 * @class  Model
 * 
 * @description This class implements the mongoose model persistency through the form handler
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
class Model {

	constructor(adapter) {
		this.needPersist = false;
		this._model = null; //mongoose model instance
		this._modelObject = null; //mongoose object
		this.adapter = adapters[adapter]; //It's already checked in form::setAdapter
	}

	set model(model) {
		if(model && typeof model === 'function') {
			this._model = new model();
			this._modelObject = model;
			this.isPersistNeeded();
		}
	}

	get model() {
		return this._model;
	}

	/**
	 * Check if model persistence is needed
	 * Set the boolean value of Model::needPersist
	 * @return {void}
	 */
	isPersistNeeded() {
		if(!this._model || this._model.constructor.name !== 'model') {
			this.needPersist = false;
		} else {
			this.needPersist = true;
		}
	}

	/**
	 * If model persistence is needed, populates form data into the model instance
	 * 
	 * @param  {Object} data form data
	 * @param  {int} id the request param id
	 * @param  {function} the callback
	 * 
	 * @return {function} first param, errors.
	 */
	persist(data, id, cb) {
		if(!this.needPersist) return cb(null);
		if(typeof id === 'function') cb = id;
		
		//Updating case
		if(typeof id !== 'function' && this.adapter) {
			this.adapter.persist(this._model, this._modelObject, id, (err, doc) => {
				if(err) return cb(err);

				this._model = doc;
				return cb(null);
			});
		} else {
			//Adding case
			for(var key in data) {
				this._model[key] = data[key].value;
			}

			return cb(null);
		}
	}
}

module.exports = Model;