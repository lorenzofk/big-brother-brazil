'use strict';


module.exports = {

  up(db, next) {

    let start = new Date();
    let end   = new Date();

    end.setDate(start.getDate() + 1);

    db.collection('big_brother').insert({
        name: "Paredão Final",
        isOpen: true,
        startsAt: start,
        endsAt: end,
        participants: [
            { name: "Maria", votes: [], totalOfVotes: 0 },
            { name: "João", votes: [], totalOfVotes: 0 }
        ],
        totalOfVotes: 0
    });

    next();
  },

  down(db, next) {
    db.collection('big_brother').drop();
    next();
  }

};