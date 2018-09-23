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

    // Before each test we empty the database
    beforeEach(function (done) {

        eliminationModel.deleteMany({}, function (err) {
            if (err) done();
        });

        done();
    });

    describe('/POST /votacao/:eliminationId/:participantId', function () {

        it('it should not POST a vote because the elimination has been closed', function (done) {

            let start = new Date();
            let end   = new Date();

            end.setTime(start.getTime() + 1);

            let model = new eliminationModel({
                name: "Paredão Finalizado",
                participants: [{ name: "Teste" }, { name: "Teste 2" }],
                startsAt: start,
                endsAt: end
            });

            model.save(function (err, model) {

                if (err) done(err);

                chai.request(server)
                    .post('/votacao/' + model.id + '/' + model.participants[0].id)
                    .set('content-type', 'application/json')
                    .send(model)
                    .end(function (err, res) {
                        if (err) done(err);
                        res.should.have.status(404);
                        done();
                    });

            });

        });


        it('it should POST a vote', function (done) {

            let start = new Date();
            let end   = new Date();

            end.setDate(start.getDate() + 1);

            let model = new eliminationModel({
                name: "Paredão Votação",
                participants: [{ name: "Teste" }, { name: "Teste 2" }],
                startsAt: start,
                endsAt: end
            });

            model.save(function (err, model) {

                if (err) done(err);

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