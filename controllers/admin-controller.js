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

                let total = response.reduce(function (acc, item) {
                    return acc + item.count;
                }, 0);

                let resume = response.map(function (item) {
                    return {
                        id: item._id,
                        percent: parseFloat((item.count / total).toFixed(2))
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

        eliminationRepository.getResumeByParticipant({ id: id, participantId: participantId })
            .then(function (response) {

                let resume = response.map(function (item) {
                    return {
                        total: item.total,
                        percent: parseFloat((item.totalOfParticipant / item.total).toFixed(2))
                    };
                });

                return res.json({'resume': resume});

            }).catch(function (err) {
                return res.status(500).send(err);
            });

    } catch (e) {
        return res.status(500).send(e);
    }
};