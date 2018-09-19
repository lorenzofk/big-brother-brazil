'use strict';

var mongoose         = require('mongoose');
var eliminationModel = require('../models/elimination-model');


module.exports = new class EliminationRepository {

    create(data) {
        return eliminationModel.create(data);
    };

    close(data) {

        return eliminationModel.findByIdAndUpdate(data.id, {
            $set: data,
            new: true
        });

    };

    getAll() {
        return eliminationModel.find();
    };
}