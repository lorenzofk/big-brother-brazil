var eliminationRepository = require('../repositories/elimination-repository');

exports.create = function (req, res) {

    let payload   = req.body;
    let dateStart = (payload.startsAt === undefined || payload.startsAt.length == 0)
            ? new Date()
            : new Date(payload.startsAt);

    if (payload.name === undefined || payload.name.length === 0) {
        res.status(422).json({'msg': 'O nome do paredão é obrigatório.'});
    }

    if (payload.candidates === undefined || payload.candidates.length < 2) {
        return res.status(422).send({'msg': 'O número mínimo de candidatos é 2.'});
    }

    if (payload.endsAt === undefined || payload.endsAt.length === 0) {
        return res.status(422).send({'msg': 'A data de encerramento do paredão é obrigatória.'});
    }

    // Previne string como data inválida
    dateStart = isNaN(dateStart.getTime()) ? new Date(): dateStart;

    if (new Date(payload.endsAt).getTime() <= dateStart.getTime()) {
        return res.status(422).send({'msg': 'A data de encerramento deve ser posterior a data de início do paredão'});
    }

    try {

        eliminationRepository.create(payload)
            .then(function (result) {
                res.status(201).json(result);
            }).catch(function (err) {

                if (err.code === 11000) {
                    res.status(422).send({'msg:': 'Este paredão já foi criado.'});
                }

                res.status(500).send(err);
            });

    } catch (e) {
        res.status(500).send(e);
    }
};

exports.list = function (req, res) {

    try {

        eliminationRepository.eliminationModel()
            .then(function (result) {
                res.json(result);
            }).catch(function (err) {
                res.status(500).send(err);
            });

    } catch (e) {
        res.status(500).send(e);
    }

};