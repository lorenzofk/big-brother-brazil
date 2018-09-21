'use strict';

var mongoose = require('mongoose');
var eliminationModel = require('../models/elimination-model').eliminationModel;
var objectId =  mongoose.Types.ObjectId;

module.exports = new class EliminationRepository {

    create(data) {
        return eliminationModel.create(data);
    };

    delete(id) {

        if (! objectId.isValid(id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.findByIdAndRemove(id)
            .then(function (res) {

                if (res === null) {
                    throw Error('Elimination not found.');
                }

                return {_id: res._id};

            }).catch(function (e) {
                throw Error(e.message);
            });
    }

    getAll() {
        return eliminationModel.find(
            { isOpen: true, endsAt: {$gte: new Date()} },
            { _id: 1, name: 1, "participants.name": 1, "participants._id": 1 }
        );
    };

    getById(id) {

        if (! objectId.isValid(id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.findById(
            { _id: id },
            { _id: 1, name: 1, "participants.name": 1, "participants._id": 1 }
        );
    };

    getResume(data) {

        if (! objectId.isValid(data.id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.find(
            { _id: data.id },
            {
                _id: 1,
                "participants._id": 1,
                "participants.totalOfVotes": 1
            }
        );
    }

    getResumeByHour(id) {

        if (! objectId.isValid(id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.aggregate([
            { $match: {"_id": objectId(id) } },
            { $unwind: '$participants' },
            { $unwind: '$participants.votes' },
            {
                $group: {
                    _id: {
                        d: { $dayOfMonth: "$participants.votes.createdAt" },
                        m: { $month: "$participants.votes.createdAt" },
                        h: { $hour: "$participants.votes.createdAt" },
                    },
                    total: { $sum: 1 }
                }
            },
            { $sort:{ "_id.m": 1 , "_id.d": 1, "_id.h": 1} }
        ]);


    }

    update(data) {

        if (! objectId.isValid(data.id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.findByIdAndUpdate(data.id, {$set: data}, {new: true});
    };

    vote(data) {

        if (! objectId.isValid(data.id) || ! objectId.isValid(data.participantId)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.findOneAndUpdate({
                "_id": data.id,
                "participants._id": data.participantId,
                "endsAt": {$gte: new Date()},
                "isOpen": true
            },
            {
                $push: {
                    "participants.$.votes": {
                        createdAt: new Date()
                    },
                },
                $inc: { "participants.$.totalOfVotes": 1 }
            },
            { fields: { "_id": 1 }, new: true }
        );

    };
}