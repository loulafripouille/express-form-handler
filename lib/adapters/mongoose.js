/**
 * @licence MIT
 * @author Louis Audeon <louis.audeon@mail.be>
 */
'use strict'

module.exports.persist = (data, modelInstance, modelObject, id, callback) => {
	modelObject.findOne({_id: id}, (err, doc) => {
		if(err) {
			return callback(err)
		}
		if (!doc) {
            return callback({err: 404})
        }

    	for(var key in data) {
			doc[key] = data[key].value
		}

		return callback(null, doc)
	})
}