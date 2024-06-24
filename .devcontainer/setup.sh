#!/bin/bash

# Function to handle errors
handle_error() {
    echo "An error occurred:"
    echo "$1"
    exit 1
}

# get repo and move user .devcontainer to temporary folder

if [ $(find . -maxdepth  1 -type d ! -name . ! -name .devcontainer | wc -l) -eq 0 ]; 
then 

# move devcontainer.json selectively 

  temp_dev=$(mktemp -d)
  
  mv .devcontainer "$temp_dev"
  git clone "$target_repo" . 
  
  mv -f "$temp_dev/.devcontainer/devcontainer.json" .devcontainer
  rm -rf "$temp_dev/.devcontainer"

else 

  echo Contents available :

fi

# Install Xvfb
echo "Installing Xvfb..."
sudo apt-get update > /tmp/apt_update.log 2>&1 || { echo "Failed to update package lists."; handle_error "Failed to update package lists."; }
sudo apt-get install -y -qq xvfb > /tmp/xvfb_install.log 2>&1 || { echo "Failed to install Xvfb."; handle_error "Failed to install Xvfb."; }

# Start Xvfb and export DISPLAY
echo "Starting Xvfb and setting DISPLAY environment variable..."

export DISPLAY=:0

# Append to .bashrc or .profile
echo "Appending export DISPLAY=:0 to.bashrc or.profile..."
if [[ -f ~/.bashrc ]]; then
    echo "export DISPLAY=:0" >> ~/.bashrc
elif [[ -f ~/.profile ]]; then
    echo "export DISPLAY=:0" >> ~/.profile
else
    echo "Neither.bashrc nor.profile found. Cannot append export DISPLAY=:99."
fi

Xvfb :0 -screen 0 1024x768x24 & > /tmp/xvfb_start.log 2>&1 || { echo "Failed to start Xvfb."; handle_error "Failed to start Xvfb."; }

sleep 5

# Install dbus-x11
echo "Installing dbus-x11..."
sudo apt-get install -y -qq dbus-x11 > /tmp/dbusx11_install.log 2>&1 || { echo "Failed to install dbus-x11."; handle_error "Failed to install dbus-x11."; }

# Attempt to start D-Bus service
echo "Attempting to start D-Bus service..."
sudo service dbus start > /tmp/dbus_start.log 2>&1 || { echo "Failed to start D-Bus service."; handle_error "Failed to start D-Bus service."; }

# Check if dbus is running
echo "Checking if dbus is running..."
if service dbus status | grep -q "inactive"; then
    echo "D-Bus is not running. Please start it manually."
else
    echo "D-Bus is running."
fi

# Installing package dependencies
echo "Installing node packages..."

 npm install

echo "Installation and setup completed successfully."