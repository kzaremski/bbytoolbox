#!/bin/bash

# Konstantin Zaremski
# Updated July 9, 2021

# Automatic installation script for the serverside,
# now installing to /etc/bbytoolbox

echo "Beginning automated deployment."

# Install required packages
echo "  Installing necessary packages."
sudo apt install -y unzip nodejs npm

# Create the /etc/bbytoolbox directory if it does not already exist
echo "  Creating '/etc/bbytoolbox'."
sudo mkdir -p /etc/bbytoolbox

# Work out of /tmp
cd /tmp
echo "  New working directory: '/tmp'."

# Download the latest snapshot of the master branch
echo "  Downloading latest production package from GitHub."
rm -rf bbytoolbox
git clone git@github.com:kzaremski/bbytoolbox.git

# Unzip the file
#echo "  Extracting package."
#unzip -qq -o main.zip

# Go into the extracted package
cd bbytoolbox
echo "  New working directory: /tmp/bbytoolbox"

# Install the node-js modules
echo "  Installing node modules."
npm install

# Build the React code into a production grade blob
echo "  Compiling production React code."
npm run build

# Change the working directory to /etc/bbytoolbox
cd /etc/bbytoolbox
echo "  New working directory: '/etc/bbytoolbox'."

# Delete all installation files in /etc/bbytoolbox
echo "  Cleaning installation directory."
sudo rm -rf *

# Copy new files
echo "  Installing package."
sudo cp -r /tmp/bbytoolbox/* ./

# Copy the systemd unit file
echo "  Registering systemd unit file."
sudo cp bbytoolbox.service /etc/systemd/system

# Set permissions/ownership of files
echo "  Setting ownership of installation files to the 'node' user."
sudo chown -R node /etc/bbytoolbox/*

# Notify
echo "Automatic Deploy Finished!"
echo "Run 'systemctl start bbytoolbox.service' to start the app server."

