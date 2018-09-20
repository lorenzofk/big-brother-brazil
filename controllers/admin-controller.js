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

            }).catch(function (err) {
                return res.status(500).send(err);
            });

    } catch (e) {
        res.status(500).send(e);
    }
};