'use strict';

/**
 * @class  Model
 * 
 * @description This class implements the mongoose model persistency through the form handler
 *
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
class Model {

	/**
	 * [constructor description]
	 * @return {[type]} [description]
	 */
	constructor() {
		this.needPersist = false;
		this._model = null; //mongoose model instance
		this._modelObject = null; //mongoose object
	}

	/**
	 * [model description]
	 * @param  {[type]} model [description]
	 * @return {[type]}       [description]
	 */
	set model(model) {
		if(!model || typeof model !== 'function') {
			this._model = false;
		} else {
			this._model = new model();
			this._modelObject = model;
			this.checkModel();
		}
	}

	get model() {
		return this._model;
	}

	checkModel() {
		if(!this._model || this._model.constructor.name !== 'model') {
			this.needPersist = false;
		} else {
			this.needPersist = true;
		}
	}

	/**
	 * [persist description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	persist(data, id, cb) {
		if(!this.needPersist) return cb(null);
		
		//Updating case
		if(id && this._modelObject) {
			this._modelObject.findOne({_id: id}, (err, doc) => {
				if(err) {
					return cb(err);
				}
				if (!doc) {
		            return cb({err: 404});
		        }

	        	for(var key in data) {
					doc[key] = data[key].value;
				}

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