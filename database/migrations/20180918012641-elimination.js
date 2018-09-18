'use strict';

module.exports = {

  up(db, next) {
    db.createCollection('big_brother');
    next();
  },

  down(db, next) {
    db.collection('big_brother').drop();
    next();
  }

};