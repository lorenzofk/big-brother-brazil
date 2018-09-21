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

        return eliminationModel.findByIdAndRemove(id);
    }

    getAll() {
        return eliminationModel.find();
    };

    getById(id) {

        if (! objectId.isValid(id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.findById(id);
    };

    getResume(data) {

        if (! objectId.isValid(data.id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.aggregate([
            { $match: {"_id": objectId(data.id) } },
            { $unwind: '$participants' },
            { $unwind: '$participants.votes' },
            { $project: {_id: '$name', participants: '$participants'} },
            {
                $group: {
                    _id: '$participants._id',
                    candidate: { $first: "$participants.name" },
                    count: {$sum: 1},
                }
            }
        ]);

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

    getResumeByParticipant(data) {

        if (! objectId.isValid(data.id) || ! objectId.isValid(data.participantId)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.aggregate([
            { $unwind: '$participants'},
            { $unwind: '$participants.votes'},
            { $match: {"_id": objectId(data.id) }},
            { $group: {
                    _id: "$name",
                    total: {'$sum': 1 },
                    totalOfParticipant: {
                        $sum: {
                            $cond: [
                                { "$eq": [ "$participants._id", objectId(data.participantId) ] },
                                1,
                                0
                            ]
                        }
                    }
                }}
        ]);


    };

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
                    }
                }
            },
            { new: true }

        );

    };
}