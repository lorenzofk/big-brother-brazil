'use strict';

var eliminationRepository = require('../repositories/elimination-repository');

exports.vote = function (req, res) {

    let id = req.params.id;
    let participantId = req.params.participantId;

    if (id === undefined || id.length === 0) {
        return res.status(422).send({'msg': 'The `id` param is required.'});
    }

    if (participantId === undefined || participantId.length === 0) {
        return res.status(422).send({'msg': 'The `participantId` param is required.'});
    }

    let vote = {
        id: id,
        participantId: participantId
    };

    try {

        eliminationRepository.vote(vote)
            .then(function(result) {

                if (result === null) {
                    return res.status(404).send({
                        'msg': 'Error computing vote: Elimination/participant not found or this elimination is closed for votes.'
                    });
                }

                eliminationRepository.getResume(vote)
                    .then(function (response) {

                        if (response[0] === undefined) {
                            return res.status(404).json({'msg': "Error in calculating votes."})
                        }

                        let total = response[0].participants.reduce(function (acc, item) {
                            return acc + item.totalOfVotes;
                        }, 0);

                        let resume = response[0].participants.map(function (item) {

                            let pct = parseFloat((item.totalOfVotes / total).toFixed(2)) || 0;

                            return {
                                id: item._id,
                                percent: pct
                            };
                        });

                        return res.json({'resume': resume, 'total': total});

                    }).catch(function (e) {
                        return res.status(500).send({'msg': e.message});
                    });

            }).catch(function (err) {
                return res.status(500).send({'msg': err.message});
            });

    } catch (error) {
        return res.status(500).send({'msg': error.message});
    }

};