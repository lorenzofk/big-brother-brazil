'use strict';

var chai     = require('chai');
var chaiHttp = require('chai-http');
var server   = require('../app').server;
var eliminationModel = require('../models/elimination-model').eliminationModel;

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('(2) - Votação BBB', function () {

    describe('/POST /votacao/:eliminationId/:participantId', function () {

        it('it should POST a vote', function (done) {

            let start = new Date();
            let end   = new Date();

            end.setDate(start.getDate() + 1);

            let model = new eliminationModel({
                name: "Paredão",
                participants: [{ name: "Teste" }, { name: "Teste 2" }],
                startsAt: start,
                endsAt: end
            });

            model.save(function (err, model) {

                chai.request(server)
                    .post('/votacao/' + model.id + '/' + model.participants[0].id)
                    .set('content-type', 'application/json')
                    .send(model)
                    .end(function (err, res) {

                        if (err) done(err);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('resume');
                        res.body.should.have.property('total');

                        done();
                    });

            });

        });

    });
});