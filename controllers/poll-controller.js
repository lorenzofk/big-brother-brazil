'use strict';

var mongoose = require('mongoose');
var request = require('request');
var eliminationRepository = require('../repositories/elimination-repository');

require('dotenv').config();


exports.showElimination = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(404);
    }

    try {

        eliminationRepository.getById(id)
            .then(function (result) {
                return res.render('app/voting', {
                    id: result._id,
                    endsAt: result.endsAt,
                    participants:
                    result.participants}
                );
            }).catch(function (e) {
            return res.render('errors/404');
        });

    } catch (err) {
        return res.render('errors/404');
    }

};

exports.voteByHuman = function (req, res) {

    let id = req.body.id;
    let participantId = req.body.participantId;
    let recaptcha = req.body.captcha;

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

        var secretKey = process.env.GOOGLE_SECRET_KEY;
        var urlVerify = process.env.GOOGLE_SITE_VERIFY;

        if ( typeof recaptcha === undefined
            || recaptcha === ''
            || recaptcha === null
        ) {

            return res.status(422).json({'msg': 'Please, select captcha'});

        }

        urlVerify += '?response='+recaptcha+'&secret='+secretKey;

        request(urlVerify, function (err, res, body) {

            body = JSON.parse(body);
            
            if (err) {
                return res.status(500).json({'msg': 'Error :/'})
            }

            if ( typeof body.success === undefined || ! body.success) {
                return res.status(422).json({'msg': 'reCAPTCHA is invalid. :/'});
            }

        });

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

                        let total = response[0].totalOfVotes;

                        let resume = response[0].participants.map(function (item) {

                            let pct = parseFloat((item.totalOfVotes / total).toFixed(2)) || 0;

                            return {
                                id: item._id,
                                name: item.name,
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

                        let total = response[0].totalOfVotes;

                        let resume = response[0].participants.map(function (item) {

                            let pct = parseFloat((item.totalOfVotes / total).toFixed(2)) || 0;

                            return {
                                id: item._id,
                                name: item.name,
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