'use strict';

module.exports = {

  mongodb: {

    url: 'mongodb://localhost:27017',

    databaseName: "bbb_test",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'migrations',

};