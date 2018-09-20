'use strict';

var eliminationModel = require('../models/elimination-model').eliminationModel;
var eliminationRepository = require('../repositories/elimination-repository');

exports.create = function (req, res) {

    let model = new eliminationModel(req.body);

    if (model.name === undefined || model.length === 0) {
        return res.status(422).json({'msg': 'The `name` field is required.'});
    }

    if (model.participants === undefined || model.participants.length < 2) {
        return res.status(422).send({'msg': 'The `participants` field is required and must be least 2.'});
    }

    if (model.startsAt === undefined || model.startsAt.length === 0) {
        return res.status(422).send({'msg': 'The `startsAt` field is required.'});
    }

    if (model.endsAt === undefined || model.endsAt.length === 0) {
        return res.status(422).send({'msg': 'The `endsAt` field is required.'});
    }

    if (new Date(model.endsAt).getTime() <= new Date(model.startsAt).getTime()) {
        return res.status(422).send({'msg': 'End date must be greater then start'});
    }

    try {

        eliminationRepository.create(model)
            .then(function (result) {
                res.status(201).json(result);
            }).catch(function (err) {

                if (err.code === 11000) {
                    return res.status(422).send({'msg:': 'This record already exists.'});
                }

                return res.status(500).send(err);
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
};

exports.delete = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(404).send({'msg': 'The `id` param is required.'});
    }

    try {

        eliminationRepository.delete(id)
            .then(function (result) {
                return res.json(result);
            }).catch(function (err) {
                return res.status(500).send(err);
            });

    } catch (e) {
        return res.status(500).send(e);
    }

};

exports.list = function (req, res) {

    try {

        eliminationRepository.getAll()
            .then(function (result) {
                return res.json(result);
            }).catch(function (err) {
            return res.status(500).send(err);
        });

    } catch (e) {
        return res.status(500).send(e);
    }

};

exports.update = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id.length === 0) {
        return res.status(422).send({'msg': 'The `id` param is required.'});
    }

    if (req.body.isOpen === undefined) {
        return res.status(422).send({'msg': 'The `isOpen` field is required.'});
    }

    // Appends the id in the request body
    req.body['id'] = id;

    try {

        eliminationRepository.update(req.body)
            .then(function(result) {
                return res.status(200).send(result);
            }).catch(function (err) {
                return res.status(500).send(err);
            });

    } catch (e) {
        return res.status(500).send(e);
    }

};

exports.show = function (req, res) {

    try {

        let id = req.params.id;

        if (id === undefined || id === '') {
            return res.status(404).send({'msg': 'The `id` param is required.'});
        }

        eliminationRepository.getById(id)
            .then(function (result) {
                return res.json(result);
            }).catch(function (err) {
                return res.status(500).send(err);
            });

    } catch (e) {
        return res.status(500).send(e);
    }

};