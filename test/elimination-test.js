'use strict';

var chai     = require('chai');
var chaiHttp = require('chai-http');
var server   = require('../app').server;
var eliminationModel = require('../models/elimination-model');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Paredão BBB', function () {

    // Before each test we empty the database
    beforeEach(function (done) {
        eliminationModel.deleteMany({}, function (err) {
            if (err) done();
            done();
        });
    });

    describe('/GET /paredao', function () {

        it('it should list all the eliminations', function (done) {

            chai.request(server)
                .get('/paredao')
                .end(function (err, res) {

                    if (err) done(err);

                    res.should.have.status(200);
                    res.body.should.be.a('array');

                    done();
                });
        });

    });

    describe('/POST /paredao', function () {

        it('it should not POST an elimination without some required fields', function (done) {

            chai.request(server)
                .post('/paredao')
                .set('content-type', 'application/json')
                .send({name: "Paredão"})
                .end(function (err, res) {

                    if (err) done(err);

                    res.should.have.status(422);

                    done();
                });

        });

        it('it should POST an elimination', function (done) {

            let start = new Date();
            let end   = new Date();

            end.setDate(start.getDate() + 1);

            let data = {
                name: "Paredão",
                candidates: [{ name: "Lorenzo" }, { name: "João" }],
                startsAt: start,
                endsAt: end
            };

            chai.request(server)
                .post('/paredao')
                .set('content-type', 'application/json')
                .send(data)
                .end(function (err, res) {

                    if (err) done(err);

                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('candidates');
                    res.body.should.have.property('isOpen');
                    expect(res.body.isOpen).to.be.an('boolean');
                    assert.equal(res.body.isOpen, true);

                    done();
                });

        });

        it('it should not POST an elimination because this record already exists', function (done) {

            let start = new Date();
            let end   = new Date();

            end.setDate(start.getDate() + 1);

            let model = new eliminationModel({
                name: "Paredão",
                candidates: [{ name: "Teste" }, { name: "Teste 2" }],
                startsAt: start,
                endsAt: end
            });

            model.save(function (err, model) {

                chai.request(server)
                    .post('/paredao')
                    .set('content-type', 'application/json')
                    .send(model)
                    .end(function (err, res) {

                        if (err) done(err);

                        res.should.have.status(422);

                        done();
                    });

            });

        });

    });

    describe('/PUT /paredao/:id', function () {

        it('it should UPDATE an elimination given the id', function (done) {

            let start = new Date();
            let end = new Date();

            end.setDate(start.getDate() + 1);

            let model = new eliminationModel({
                name: "Paredão 1",
                startsAt: start,
                endsAt: end,
                isOpen: false
            });

            model.save(function (err, model) {

                if (err) done(err);

                chai.request(server)
                    .put('/paredao/' + model.id)
                    .send(model)
                    .end(function (err, res) {

                        if (err) done(err);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('isOpen');
                        expect(res.body.isOpen).to.be.an('boolean');
                        assert.equal(res.body.isOpen, false);

                        done();
                    });

            });

        });

    });

    describe('/GET /paredao/:id', function () {

        it('it should GET an elimination by the given id', function (done) {

            let start = new Date();
            let end = new Date();

            end.setDate(start.getDate() + 1);

            let model = new eliminationModel({
                name: "Teste",
                startsAt: start,
                endsAt: end
            });

            model.save(function (err, model) {

                if (err) done(err);

                chai.request(server)
                    .get('/paredao/' + model.id)
                    .end(function (err, res) {

                        if (err) done(err);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('candidates');
                        res.body.should.have.property('isOpen');
                        res.body.should.have.property('_id').eql(model.id);

                        done();
                    });

            })
        });

    });

    describe('/DELETE /paredao/:id', function () {

        it('it should DELETE an elimination by the given id', function (done) {

            let start = new Date();
            let end = new Date();

            end.setDate(start.getDate() + 1);

            let model = new eliminationModel({
                name: "Teste",
                startsAt: start,
                endsAt: end
            });

            model.save(function (err, model) {

                if (err) done(err);

                chai.request(server)
                    .delete('/paredao/' + model.id)
                    .end(function (err, res) {

                        if (err) done();

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('_id').eql(model.id);

                        done();
                    });

            });
        });

    });

});