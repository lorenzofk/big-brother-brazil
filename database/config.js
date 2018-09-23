'use strict';

module.exports = {

    mongodb: {

        url: process.env.MONGODB_URI,

        databaseName: process.env.DATABASE_NAME,

        options: {
            useNewUrlParser: true,
        }

    },

    migrationsDir: 'migrations',

    changelogCollectionName: 'migrations',

};