#!/bin/bash

# ==============================================================================
# NTP Client Setup Script (Chrony) for Ubuntu
# ==============================================================================
# This script configures Chrony to use the TCIOE NTP server as the time source.
# It removes default pool servers and uses the designated NTP server instead.
#
# USAGE:
#   sudo ./setup_ntp_client_on_other_Vm.sh
# ==============================================================================

set -e

# --- Configuration ---
NTP_SERVER="ntp.tcioe.edu.np"
CONFIG_FILE="/etc/chrony/chrony.conf"
BACKUP_FILE="/etc/chrony/chrony.conf.bak.$(date +%F_%T)"

# Check for root privileges
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run as root."
   exit 1
fi

echo "[*] Starting NTP Client Setup..."
echo "[*] Configuring to use: $NTP_SERVER"

# 1. Update and Install Chrony
echo "[*] Installing Chrony..."
apt-get update -qq
apt-get install -y chrony

# 2. Backup existing configuration
if [ -f "$CONFIG_FILE" ]; then
    echo "[*] Backing up current config to $BACKUP_FILE..."
    cp "$CONFIG_FILE" "$BACKUP_FILE"
fi

# 3. Write new configuration
# - 'server': Uses your specific NTP server with iburst for quick initial sync.
# - 'makestep': Allows clock to jump if drift is > 1 sec in first 3 updates.
# - 'driftfile': Records rate at which system clock gains/losses time.
# - 'rtcsync': Enables kernel synchronization of the real-time clock (RTC).
echo "[*] Generating configuration file..."
cat <<EOF > "$CONFIG_FILE"
# Use your local NTP server
server $NTP_SERVER iburst

# Fallback to public NTP pool if local server is unavailable
pool pool.ntp.org iburst

# Record the rate at which the system clock gains/losses time.
driftfile /var/lib/chrony/chrony.drift

# Allow the system clock to be stepped in the first three updates
# if its offset is larger than 1 second.
makestep 1.0 3

# Enable kernel synchronization of the real-time clock (RTC).
rtcsync

# Specify directory for log files.
logdir /var/log/chrony

# Select which information is logged.
# log measurements statistics tracking
EOF

# 4. Restart Service
echo "[*] Restarting Chrony service..."
systemctl restart chrony
systemctl enable chrony

# 5. Wait for synchronization
echo "[*] Waiting for time synchronization (this may take a few seconds)..."
sleep 3

# 6. Verification
echo "[*] Setup complete."
echo "----------------------------------------------------"
echo "Configured to use NTP server: $NTP_SERVER"
echo ""
echo "Current synchronization status:"
chronyc tracking
echo "----------------------------------------------------"
echo ""
echo "NTP sources:"
chronyc sources
echo "----------------------------------------------------"
echo ""
echo "Use 'chronyc tracking' to check sync status anytime."
echo "Use 'chronyc sources' to see all NTP sources."
