'use strict';

module.exports = {

    mongodb: {

        url: 'mongodb://localhost:27017',

        databaseName: "bbb_test",

        options: {
            useNewUrlParser: true,
        }

    },

    migrationsDir: 'migrations',

    changelogCollectionName: 'migrations',

};