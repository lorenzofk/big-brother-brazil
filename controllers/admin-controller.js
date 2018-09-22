'use strict';

var eliminationRepository = require('../repositories/elimination-repository');

exports.index = function (req, res) {

    try {

        eliminationRepository.getAll()
            .then(function (result) {
                console.log(result);
                return res.render('admin/elimination/index', {
                    result: result
                });
            }).catch(function (e) {
            return res.render('errors/404');
        });

    } catch (err) {
        return res.render('errors/404');
    }

};

exports.show = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(404);
    }

    try {

        eliminationRepository.getById(id)
            .then(function (result) {
                return res.render('admin/elimination/show', {
                    id: result._id,
                    name: result.name,
                    totalOfVotes: result.totalOfVotes.toLocaleString(),
                    endsAt: result.endsAt,
                    isOpen: result.isOpen,
                    participants: result.participants
                });
            }).catch(function (e) {
            return res.render('errors/404');
        });

    } catch (err) {
        return res.render('errors/404');
    }

};

exports.listResumeOfVotes = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(404);
    }

    return res.render('admin/elimination/all-votes', { id: id });
};

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
                        name: item.name,
                        percent: pct
                    };
                });

                return res.json({'resume': resume, 'total': total.toLocaleString()});

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