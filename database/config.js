'use strict';

module.exports = {

    mongodb: {

        url: process.env.MONGODB_URI,

        databaseName: "bbb",

        options: {
            useNewUrlParser: true,
        }

    },

    migrationsDir: 'migrations',

    changelogCollectionName: 'migrations',

};