/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

module.exports.checkModel = (model) => {
	let testInstance

	if(
		model &&
		typeof model === 'function'
	) {
		testInstance = new model()
		if(
			testInstance && 
			testInstance.constructor.name === 'model'
		) {
			return true
		}
	}

	return false
}

module.exports.persist = (data, modelInstance, modelObject, id, callback) => {
	.findById(id)
		.then(doc => {
			for(var key in data) {
				doc[key] = data[key].value
			}
			callback(null, doc)
		})
		.catch(err => callback(err))
}