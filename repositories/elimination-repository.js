'use strict';

var mongoose         = require('mongoose');
var eliminationModel = require('../models/elimination-model');


module.exports = new class EliminationRepository {

    create(data) {
        return eliminationModel.create(data);
    };

    eliminationModel() {
        return eliminationModel.find();
    };
}