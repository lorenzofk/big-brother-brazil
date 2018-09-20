'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var voteSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

var participantSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    votes: [voteSchema]
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
    participants: [participantSchema]
}, { collection: 'big_brother' });

var voteModel        = mongoose.model('voteModel', voteSchema);
var eliminationModel = mongoose.model('eliminationModel', eliminationSchema);
var participantModel = mongoose.model('participantModel', participantSchema);

module.exports = {
    eliminationModel: eliminationModel,
    voteModel: voteModel,
    participantModel: participantModel
};