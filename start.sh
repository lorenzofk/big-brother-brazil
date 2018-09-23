#!/usr/bin/env bash

# Install dependencies
#npm install

# Create the database and seed an elimination
cd database

MONGODB_URI='mongodb://127.0.0.1/bbb' migrate-mongo up

