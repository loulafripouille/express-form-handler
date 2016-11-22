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

module.exports.persist = (data, modelObject, id, callback) => {
	modelObject
		.findById(id)
		.then(doc => {
			let obj = Object.keys(data).reduce((acc, key) => {
				acc[key] = data[key].value
				return acc
			}, {})
			Object.assign(doc, obj);
			callback(null, doc)
		})
		.catch(err => callback(err))
}