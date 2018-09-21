'use strict';

var eliminationRepository = require('../repositories/elimination-repository');

exports.showResume = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(422).send({'msg': 'The `id` param is required.'});
    }

    try {

        eliminationRepository.getResume({id: id})
            .then(function (response) {

                if (response[0] === undefined) {
                    return res.status(404).json({'msg': "Error in calculating votes."})
                }

                let total = response[0].totalOfVotes;

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

    } catch (err) {
        return res.status(500).send({'msg': err.message});
    }
};

exports.showResumeByHour = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(422).send({'msg': 'The `id` param is required.'});
    }

    try {

        eliminationRepository.getResumeByHour(id)
            .then(function (response) {
                return res.json({'resume': response});
            }).catch(function (err) {
                return res.status(500).send(err);
            });

    } catch (e) {
        return res.status(500).send(e);
    }

};

exports.showResumeByParticipant = function (req, res) {

    let id = req.params.id;
    let participantId = req.params.participantId;

    if (id === undefined || id.length === 0) {
        return res.status(422).send({'msg': 'The `id` param is required.'});
    }

    if (participantId === undefined || participantId.length === 0) {
        return res.status(422).send({'msg': 'The `participantId` param is required.'});
    }

    try {

        eliminationRepository.getResume({ id: id })
            .then(function (response) {

                let total = response[0].totalOfVotes;

                let resume = response[0].participants.reduce(function(filtered, item) {

                    if (item._id == participantId) {

                        let resumeOfParticipant = {
                            percent: parseFloat((item.totalOfVotes / total).toFixed(2)) || 0
                        }

                        filtered.push(resumeOfParticipant);
                    }

                    return filtered;

                }, []);

                return res.json({'resume': resume});

            }).catch(function (e) {
                return res.status(500).send({'msg': e.message});
            });

    } catch (err) {
        return res.status(500).send({'msg': err.message});
    }
};