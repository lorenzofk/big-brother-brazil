'use strict';

require('dotenv').config();

module.exports = {

    mongodb: {

        url: process.env.MONGODB_URI || '127.0.0.1:27017',

        databaseName: process.env.DATABASE_NAME || 'big_brother',

        options: {
            useNewUrlParser: true,
        }

    },

    migrationsDir: 'migrations',

    changelogCollectionName: 'migrations',

};