'use strict';

var chai     = require('chai');
var chaiHttp = require('chai-http');
var server   = require('../app').server;
var eliminationModel = require('../models/elimination-model').eliminationModel;

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('(3) - Resultados Parciais BBB', function () {

    // Before each test we empty the database
    beforeEach(function (done) {

        // Don't remove my document used by tests
        let query = { _id: { $ne: "5ba3ae10a745ea48ec7ee153" } };

        eliminationModel.deleteMany(query, function (err) {
            if (err) done();
        });

        done();
    });

    describe('/GET /admin/resultados/votos/:eliminationId', function () {

        it('it should GET all votes group by participant', function (done) {

            let start = new Date();
            let end   = new Date();

            end.setDate(start.getDate() + 1);

            let model = new eliminationModel({
                name: "Paredão Resumo",
                participants: [{ name: "Teste_123" }, { name: "Teste_2" }],
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

                        chai.request(server)
                            .post('/votacao/' + model.id + '/' + model.participants[1].id)
                            .set('content-type', 'application/json')
                            .send(model)
                            .end(function (err, res) {

                                if (err) done(err);

                                res.should.have.status(200);

                                chai.request(server)
                                    .get('/admin/resultados/votos/' + model.id)
                                    .end(function (err, res) {
                                        if (err) done(err);

                                        res.should.have.status(200);
                                        res.body.should.have.property('resume');
                                        res.body.should.have.property('total');
                                        res.body.resume.should.be.a('array');
                                        assert.equal(res.body.total, 2);
                                        assert.equal(res.body.resume[0].percent, res.body.resume[1].percent);

                                        done();
                                    });

                            });

                    });
            });

        });

    });

    describe('/GET /admin/resultados/votosPorHora/:eliminationId', function () {

        it('it should GET all votes group by hour from a specific elimination', function (done) {

            chai.request(server)
                .get('/paredao')
                .end(function (err, res) {

                    if (err) done(err);

                    chai.request(server)
                        .get('/admin/resultados/votosPorHora/' + res.body[0]._id)
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.be.have.property('resume');
                            done();
                        });
                });

        });

    });

    describe('/GET /admin/resultados/votos/:eliminationId/:participantId', function () {

        it('it should GET all votes from one participant', function (done) {

            chai.request(server)
                .get('/paredao')
                .end(function (err, res) {

                    if (err) done(err);

                    chai.request(server)
                        .get('/admin/resultados/votos/' + res.body[0]._id + '/' + res.body[0].participants[0]._id)
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.be.have.property('resume');
                            done();
                        });

                });

        });

    });
    
});