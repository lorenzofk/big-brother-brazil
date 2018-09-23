#!/usr/bin/env bash

# Update the package list
sudo apt update

# Install NodeJS
sudo apt install -y nodejs

# Install NPM
sudo apt install -y npm

# Adds the MongoDB repository
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

# Adds MongoDB repository details for the 'apt' find the packages
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# Update the package list again
sudo apt update

# Install MongoDB
sudo apt-get install -y mongodb-org

exit 0