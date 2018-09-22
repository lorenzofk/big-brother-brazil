'use strict';

var eliminationRepository = require('../repositories/elimination-repository');

exports.index = function (req, res) {

    try {

        eliminationRepository.getAll()
            .then(function (result) {
                console.log(result);
                return res.render('app/index', {
                    result: result
                });
            }).catch(function (e) {
            return res.render('errors/404');
        });

    } catch (err) {
        return res.render('errors/404');
    }

};