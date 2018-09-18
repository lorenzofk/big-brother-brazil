'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var votesSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

var candidatesSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    votes: [votesSchema]
});

var eliminationSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    startsAt: {
        type: Date,
        required: true
    },
    endsAt: {
        type: Date,
        required: true
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    candidates: [candidatesSchema]
}, { collection: 'big_brother' });


module.exports = mongoose.model('EliminationModel', eliminationSchema);