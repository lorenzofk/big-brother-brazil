'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var voteSchema = new Schema({ createdAt: { type: Date, default: Date.now() } });

var participantSchema = new Schema({
    name: { type: String, trim: true, required: true },
    totalOfVotes: { type: Number, default: 0 },
    votes: [voteSchema]
});

var eliminationSchema = new Schema({
    name: { type: String, trim: true, unique: true, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    isOpen: { type: Boolean, default: true },
    participants: [participantSchema]
}, { collection: 'big_brother' });

function validateInput(model, next) {

    if (model.name === undefined || model.name.length === 0) {
        next(new Error('The `name` field is required.'));
    }

    if (model.participants === undefined || model.participants.length < 2) {
        next(new Error('The `participants` field is required and must be least 2.'))
    }

    if (model.startsAt === undefined || model.startsAt === null) {
        next(new Error('The `startsAt` field is required.'));
    }

    if (model.endsAt === undefined || model.endsAt === null) {
        next(new Error('The `endsAt` field is required.'));
    }

    if (model.endsAt <= model.startsAt) {
        next(new Error('End Date must be greater than Start Date'));
    }

}

eliminationSchema.pre('validate', function(next) {

    validateInput(this, next);

    return this.constructor.findOne({ name: this.name, _id: { $ne: this._id } })
        .then(function (model) {
            if (model) return next(new Error('This document already exists.'));
            next();
        }).catch(function (err) {
            next(new Error(err));
        })

});

var voteModel        = mongoose.model('voteModel', voteSchema);
var eliminationModel = mongoose.model('eliminationModel', eliminationSchema);
var participantModel = mongoose.model('participantModel', participantSchema);

module.exports = {
    eliminationModel: eliminationModel,
    voteModel: voteModel,
    participantModel: participantModel
};