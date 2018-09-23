#!/usr/bin/env bash

# Install dependencies
npm install

# Create the database and seed an elimination
cd database

MONGODB_URI='mongodb://127.0.0.1/' DATABASE_NAME='bbb' migrate-mongo up

exit 0
