#!/bin/bash

# Konstantin Zaremski
# Updated July 9, 2021

# Automatic installation script for the serverside,
# now installing to /etc/bbytoolbox

echo "Beginning automated deployment."

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
curl -O https://github.com/kzaremski/bbytoolbox/archive/refs/heads/main.zip

# Unzip the file
echo "  Extracting package."
unzip -qq bbytoolbox-main.zip

# Move the files from the unzipped folder in to the main directory to
# overwrite the existing ones within the installation directory
echo "  Installing package."
cp -a bbytoolbox-main/* ./

# Delete the ZIP file & folder
echo "  Cleaning up installation files."
rm bbytoolbox-main.zip
rm -r bbytoolbox-main

# Copy the systemd unit file
echo "  Registering systemd unit file."
cp bbytoolbox.

# Install the node-js modules
echo "  Installing node modules."
npm install

# Build the React code into a production grade blob
echo "  Creating "
npm run build

# Notify
echo "Automatic Deploy Finished!"
echo "Run 'systemctl start bbytoolbox.service' to start the app server."