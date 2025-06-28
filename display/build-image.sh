#!/bin/bash

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMP_DIR=$(mktemp -d)
BUILD_DIR="$SCRIPT_DIR/build"

# Cleanup function
cleanup() {
    echo "Cleaning up temporary directory: $TEMP_DIR"
    rm -rf "$TEMP_DIR"
}

# Set trap to cleanup on exit
trap cleanup EXIT

echo "Building Raspberry Pi OS Kiosk image..."
echo "Temporary directory: $TEMP_DIR"

# Create build directory if it doesn't exist
mkdir -p "$BUILD_DIR"

# Clone pi-gen repository
echo "Cloning pi-gen repository..."
cd "$TEMP_DIR"
git clone https://github.com/RPi-Distro/pi-gen.git
cd pi-gen

# Switch to arm64 branch for 64-bit build
echo "Switching to arm64 branch..."
git checkout arm64

# Copy raspi configuration and customizations
echo "Copying custom configuration..."
cp -r "$SCRIPT_DIR/raspi/"* .

# Generate random password for root
ROOT_PASSWORD=$(openssl rand -hex 16)
echo "FIRST_USER_PASS=$ROOT_PASSWORD" >> config

# Configure the build stages
echo "Configuring build stages..."
# Remove stage2 export to prevent early image creation
rm -f stage2/EXPORT_IMAGE

# Create stage3 export to generate final image
touch stage3/EXPORT_IMAGE

# Skip stages 4 and 5 to only build up to stage 3
touch stage4/SKIP stage5/SKIP
touch stage4/SKIP_IMAGES stage5/SKIP_IMAGES

# Run the docker build
echo "Starting docker build..."
./build-docker.sh -c config

# Copy the built image to our build directory
echo "Copying built image..."
cp deploy/*-kiosk.zip "$BUILD_DIR/" 2>/dev/null || {
    echo "Warning: No *-kiosk.zip files found in deploy directory"
    echo "Available files in deploy:"
    ls -la deploy/ || echo "Deploy directory not found"
}

echo "Build completed successfully!"
echo "Output files copied to: $BUILD_DIR" 