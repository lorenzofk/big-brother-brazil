'use strict';

var mongoose = require('mongoose');
var eliminationModel = require('../models/elimination-model').eliminationModel;

module.exports = new class EliminationRepository {

    create(data) {
        return eliminationModel.create(data);
    };

    delete(id) {
        return eliminationModel.findByIdAndRemove(id);
    }

    getAll() {
        return eliminationModel.find();
    };

    getById(id) {
        return eliminationModel.findById(id);
    };

    getResume(data) {

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
        return eliminationModel.findByIdAndUpdate(data.id, {$set: data}, {new: true});
    };

    //TODO Validate if ids are of type ObjectType
    vote(data) {

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