# Client Box

This directory contains everything necessary to create an OS image for the box that will be displaying train schedule.

Boot from this image and it will start full-screen Chromium browser in kiosk mode pointing at https://7fca2079.backbay.pages.dev/view/BBY.

Supported hardware:

* Raspberry Pi 4
* Raspberry Pi 5

# Building and Flashing OS Image to SD Card

✅ Tested on MacBook M4 (arm64).

* `make build`
* Run [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
* Set `Raspberry Pi Device` to Raspberry Pi 4 or 5
* For `Operating System` choose `Use Custom` (at the bottom) and select image from `build/`
* Insert SD Card and flash
* Boot from SD Card and enjoy