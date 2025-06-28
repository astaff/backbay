#!/bin/bash -e

echo "============================================"
echo "KIOSK SETUP SCRIPT STARTING"
echo "============================================"

# Create directories
mkdir -p /home/kiosk
mkdir -p /var/log/pi-gen

# Auto-login configuration
mkdir -p /etc/systemd/system/getty@tty1.service.d/
cat > /etc/systemd/system/getty@tty1.service.d/autologin.conf << AUTOLOGIN
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin kiosk --noclear %I \$TERM
AUTOLOGIN

# CRITICAL: Disable display managers and enable text console auto-login
systemctl set-default multi-user.target
systemctl disable lightdm || true
systemctl disable gdm3 || true
systemctl disable sddm || true
systemctl disable xdm || true
systemctl enable getty@tty1

# Create kiosk startup script
cat > /home/kiosk/kiosk.sh << 'KIOSKSCRIPT'
#!/bin/bash
xset s off
xset -dpms
xset s noblank
openbox-session &
chromium-browser \
  --noerrdialogs \
  --disable-infobars \
  --kiosk \
  --no-first-run \
  --disable-translate \
  --disable-features=TranslateUI \
  --disk-cache-dir=/dev/null \
  --overscroll-history-navigation=disabled \
  --disable-pinch \
  --check-for-update-interval=31536000 \
  https://7fca2079.backbay.pages.dev/view/BBY
KIOSKSCRIPT

chmod +x /home/kiosk/kiosk.sh

# Auto-start X and kiosk on login
cat > /home/kiosk/.bash_profile << 'BASHPROFILE'
if [ -z "$DISPLAY" ] && [ "$(tty)" = "/dev/tty1" ]; then
  exec startx /home/kiosk/kiosk.sh -- -nocursor
fi
BASHPROFILE

# Fix ownership
chown -R kiosk:kiosk /home/kiosk/

echo "============================================"
echo "KIOSK SETUP COMPLETED"
echo "============================================"
