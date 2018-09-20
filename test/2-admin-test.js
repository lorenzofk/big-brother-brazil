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
        eliminationModel.deleteMany({}, function (err) {
            if (err) done();
            done();
        });
    });

    describe('/GET /admin/resultados/votos/:eliminationId', function () {

        it('it should GET all votes group by participant', function (done) {

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
});