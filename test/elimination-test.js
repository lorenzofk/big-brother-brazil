/**
 * Arquivo de testes dos endpoints relacionados ao paredão
 *
 * @author Lorenzo Kniss
*/

var chai     = require('chai');
var chaiHttp = require('chai-http');
var server   = require('../app').server;

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Testes referentes ao Paredão', function () {

    describe('/get', function () {

        it('O status do retorno deve ser 200', function (done) {

            chai.request(server)
                .get('/paredao')
                .end(function (err, res) {
                    if (err) done(err);
                    res.should.have.status(200);
                    done();
                });
        });

        it('O retorno deve ser do tipo "Array"', function (done) {

            chai.request(server)
                .get('/paredao')
                .end(function (err, res) {
                    if (err) done(err);
                    res.body.should.be.a('array');
                    done();
                });

        });

    });

    describe('/post', function () {

        it('Deve criar um paredão com os participantes', function (done) {

            let start = new Date();
            let end   = new Date();

            // Adiciona um dia para o fim da votação
            end.setDate(start.getDate() + 1);

            let data = {
                name: "Paredão 1",
                candidates: [{ name: "Pedro" }, { name: "João" }],
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
                    res.body.should.have.property('_id');
                    res.body.should.have.property('candidates');
                    res.body.should.have.property('isOpen');
                    assert.equal(res.body.isOpen, true);

                    done();
                });

        });

        it('Deve retornar erro pois o paredão já existe', function (done) {

            let start = new Date();
            let end   = new Date();

            // Adiciona um dia para o fim da votação
            end.setDate(start.getDate() + 1);

            let data = {
                name: "Paredão 1",
                candidates: [{ name: "Teste" }, { name: "Teste 2" }],
                startsAt: start,
                endsAt: end
            };

            chai.request(server)
                .post('/paredao')
                .set('content-type', 'application/json')
                .send(data)
                .end(function (err, res) {

                    if (err) done(err);

                    res.should.have.status(422);

                    done();
                });

        });

    })
});