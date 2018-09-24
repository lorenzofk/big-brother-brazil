'use strict';

var eliminationRepository = require('../repositories/elimination-repository');

/**
 * Returns a view with all Eliminations
 */
exports.index = function (req, res) {

    try {

        eliminationRepository.getAll()
            .then(function (result) {
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

/**
 * Returns a view with specific information from an Elimination
 * @params id
 */
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

/**
 * Returns a view with summary of votes from an Elimination
 * @params id
 */
exports.listResumeOfVotes = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(404);
    }

    return res.render('admin/elimination/all-votes', { id: id });
};

/**
 * Returns a view with summary of votes by hour from an Elimination
 * @params id
 */
exports.listResumeOfVotesByHour = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(404);
    }

    return res.render('admin/elimination/votes-by-hour', { id: id });

};

/**
 * Returns JSON with the summary of votes from an Elimination
 * @params id
 */
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

/**
 * Returns JSON with the summary of votes by hour from an Elimination
 * @params id
 */
exports.showResumeByHour = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(422).send({'msg': 'The `id` param is required.'});
    }

    try {

        eliminationRepository.getResumeByHour(id)
            .then(function (response) {

                var resume = response.map(function (item) {

                    let day = item._id.d;
                    let month = (item._id.m);
                    let hour = (item._id.h < 10) ? "0" + item._id.h : item._id.h;

                    return {
                        period: day + '/' + month + ' ' + hour + 'h',
                        total: item.total
                    };

                });

                return res.json({'resume': resume});

            }).catch(function (e) {
                return res.status(500).send({'msg': e.message});
            });

    } catch (err) {
        return res.status(500).send({'msg': err.message});
    }

};

/**
 * Returns JSON with the summary of votes by participant from and Elimination
 * @params id
 * @params participantId
 */
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