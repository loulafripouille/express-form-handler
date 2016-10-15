'use strict';

class Model {

	constructor() {}

	set model(model) {
		if(!model) {
			this.needPersist = false;
		}
		this.needPersist = true;
	}

	set needPersist(needPersist) {}

	persist(data) {
		for(key in data) {
			if(this.model.key) {
				this.model.key = data[key];
			}
		}
	}
}

module.exports = Model;