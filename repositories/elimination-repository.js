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
            { $match: {"_id": mongoose.Types.ObjectId(data.id) } },
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

    update(data) {

        if (! objectId.isValid(data.id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.findByIdAndUpdate(data.id, {$set: data}, {new: true});
    };

    vote(data) {

        // TODO validate if the elimination is open to vote

        if (! objectId.isValid(data.id)) {
            throw Error('This id is invalid.');
        }

        return eliminationModel.findOneAndUpdate({
                "_id": data.id,
                "participants._id": data.participantId
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