'use strict';

module.exports = {

  up(db, next) {
    db.createCollection('elimination');
    next();
  },

  down(db, next) {
    db.collection('elimination').drop();
    next();
  }

};