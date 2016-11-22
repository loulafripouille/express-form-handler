/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

const 
	requiredir = require("require-dir"),
    adapters = requiredir('./adapters')

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
		this.needPersist = false
		this._model = null //mongoose model instance
		this._modelObject = null //mongoose object
		this.adapter = adapters[adapter] //It's already checked in form::setAdapter
	}

	set model(model) {
		if(this.adapter.checkModel(model)) {
			this._model = new model()
			this._modelObject = model
			this.needPersist = true
		}
	}

	get model() {
		return this._model
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
		if(!this.needPersist) return cb(null)
		if(typeof id === 'function')  {
			cb = id
			id = null
		}
		
		//Updating case
		if(id) {
			this.adapter.persist(data, this._modelObject, id, (err, doc) => {
				if(err) return cb(err)
 
				return cb(null, doc)
			})
		} else {
			//Adding case
			for(var key in data) {
				this._model[key] = data[key].value
			}

			return cb(null, this._model)
		}
	}
}

module.exports = Model