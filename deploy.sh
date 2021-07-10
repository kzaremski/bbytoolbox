#!/bin/bash

# Konstantin Zaremski
# Updated July 9, 2021

# Automatic installation script for the serverside,
# now installing to /etc/bbytoolbox

echo "Beginning automated deployment."

# Install required packages
echo "  Installing necessary packages."
apt install -y unzip nodejs npm

# Create the /etc/bbytoolbox directory if it does not already exist
echo "  Creating '/etc/bbytoolbox'."
mkdir -p /etc/bbytoolbox

# Change the working directory to /etc/bbytoolbox
cd /etc/bbytoolbox
echo "  New working directory: '/etc/bbytoolbox'."

# Delete all installation files in /etc/bbytoolbox
echo "  Cleaning installation directory."
rm -rf *

# Download the latest snapshot of the master branch
echo "  Downloading latest production package from GitHub."
wget https://github.com/kzaremski/bbytoolbox/archive/refs/heads/main.zip

# Unzip the file
echo "  Extracting package."
unzip -qq main.zip

# Move the files from the unzipped folder in to the main directory to
# overwrite the existing ones within the installation directory
echo "  Installing package."
cp -ra bbytoolbox-main/* ./

# Delete the ZIP file & folder
echo "  Cleaning up installation files."
rm main.zip
rm -r bbytoolbox-main

# Copy the systemd unit file
echo "  Registering systemd unit file."
cp bbytoolbox.service /etc/systemd/system

# Install the node-js modules
echo "  Installing node modules."
npm install

# Build the React code into a production grade blob
echo "  Compiling production React code."
npm run build

# Set permissions/ownership of files
echo "  Setting ownership of installation files to the 'node' user."
sudo chown -R node /etc/bbytoolbox/*

# Notify
echo "Automatic Deploy Finished!"
echo "Run 'systemctl start bbytoolbox.service' to start the app server."

