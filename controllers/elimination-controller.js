var eliminationRepository = require('../repositories/elimination-repository');

exports.create = function (req, res) {

    let payload   = req.body;
    let dateStart = (payload.startsAt === undefined || payload.startsAt.length == 0)
            ? new Date()
            : new Date(payload.startsAt);

    if (payload.name === undefined || payload.name.length === 0) {
        return res.status(422).json({'msg': 'The `name` field is required.'});
    }

    if (payload.candidates === undefined || payload.candidates.length < 2) {
        return res.status(422).send({'msg': 'The `candidates` field is required and must be least 2.'});
    }

    if (payload.endsAt === undefined || payload.endsAt.length === 0) {
        return res.status(422).send({'msg': 'The `endsAt` field is required.'});
    }

    // Prevents invalid date
    dateStart = isNaN(dateStart.getTime()) ? new Date(): dateStart;

    if (new Date(payload.endsAt).getTime() <= dateStart.getTime()) {
        return res.status(422).send({'msg': 'End date must be greater then start'});
    }

    try {

        eliminationRepository.create(payload)
            .then(function (result) {
                res.status(201).json(result);
            }).catch(function (err) {

                if (err.code === 11000) {
                    return res.status(422).send({'msg:': 'This record already exists.'});
                }

                return res.status(500).send(err);
            });

    } catch (e) {
        return res.status(500).send(e);
    }
};

exports.update = function (req, res) {

    let id = req.params.id;

    if (id === undefined || id === '') {
        return res.status(404).send({'msg': 'The `id` param is required.'});
    }

    if (req.body.isOpen === undefined) {
        return res.status(422).send({'msg': 'The `isOpen` field is required.'});
    }

    // Appends the id in the request body
    req.body['id'] = id;

    eliminationRepository.update(req.body)
        .then(function(result) {
            return res.status(200).send(result);
        }).catch(function (err) {
            return res.status(500).send(err);
        });

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