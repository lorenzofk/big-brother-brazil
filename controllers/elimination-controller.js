'use strict';

var eliminationModel = require('../models/elimination-model').eliminationModel;
var eliminationRepository = require('../repositories/elimination-repository');

exports.create = function (req, res) {

    let model = new eliminationModel(req.body);

    try {

        eliminationRepository.create(model)
            .then(function (result) {
                res.status(201).json(result);
            }).catch(function (err) {
                return res.status(422).send({'msg': err.message});
            });

    } catch (e) {
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
                return res.status(500).send({'msg': err.message});
            });

    } catch (e) {
        return res.status(500).send({'msg': e.message});
    }

};

exports.list = function (req, res) {

    try {

        eliminationRepository.getAll()
            .then(function (result) {
                return res.json(result);
            }).catch(function (err) {
                return res.status(500).send({'msg': err.message});
            });

    } catch (e) {
        return res.status(500).send({'msg': e.message});
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

                if (result === null) {
                    return res.status(404).json({'msg': 'Elimination not found.'});
                }

                return res.status(200).send(result);

            }).catch(function (err) {
                return res.status(500).send({'msg': err.message});
            });

    } catch (e) {
        return res.status(500).send({'msg': e.message});
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

                if (result === null) {
                    return res.status(404).json({'msg': 'Elimination not found.'});
                }

                return res.json(result);

            }).catch(function (err) {
                return res.status(500).send({'msg': err.message});
            });

    } catch (e) {
        return res.status(500).send({'msg': e.message});
    }

};