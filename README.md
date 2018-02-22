newCARTADesktop
=======

The idea is to interface with newCARTA through an [Electron App](https://electronjs.org) where the [CARTA c++](https://github.com/CARTAvis/carta) and [CARTA Meteor client](https://github.com/CARTAvis/newCARTAMeteorApp) are running from a [Docker](https://www.docker.com/) container on the user's machine. 

---

### Note: To run in Local Mode, Docker  needs to be installed on your system

#### Easy way to install docker on Linux:
1. `curl -fsSL https://get.docker.com/ | sh` Need to enter root password.
2. `sudo systemctl start docker`
3. `sudo systemctl enable docker` for docker to start automatically on boot.
4. `sudo usermod -a -G docker $USER` so the normal user has permission to run docker.
5. Log out and in, or reboot system  to enable Step 4.
6. `docker pull ajmasiaa/newcarta_meteor_v2` to download the docker image.
7. `xhost +` to allow x11 to work in the running docker container

#### Easy way to install docker on Mac:
1. Install Docker from the dmg: https://download.docker.com/mac/stable/Docker.dmg 
2. docker pull ajmasiaa/newcarta_meteor_v2

---

### To directly run the docker image

The docker image can be run directly for testing. The included `start.sh` simply executes the CARTA c++ and then starts the Meteor client. Once it is running, the user can open localhost:3000 in their webrowser.

#### Linux:
Tested on CentOS7, Ubuntu 17.04, Fedora 24
1. `xhost +`
2. `docker run -p 3000:3000 -p 9999:9999 -e DISPLAY=$DISPLAY -ti -v /tmp/.X11-unix:/tmp/.X11-unix  ajmasiaa/newcarta_meteor_v2 /start.sh`
3. Open any web browser and go to the URL `localhost:3000`

#### Mac:
1. `docker run -p 3000:3000 -p 9999:9999 -e DISPLAY=docker.for.mac.host.internal:0 -ti -v /tmp/.X11-unix:/tmp/.X11-unix  ajmasiaa/newcarta_meteor_v2 /start.sh`
2. Open any web browser and go to the URL `localhost:3000`

---

### To build and run the Electron App
A requirement for CARTA is to be a standalone desktop application. This can be achieved with newCARTA using Electron. Electron is effectively a very basic Chrome browser window which displays newCARTA running locally (localhost:3000) on the users machine.

1. Install Meteor on your system `curl https://install.meteor.com/ | sh`
1. `git clone https://github.com/CARTAvis/newCARTADesktop.git`
2. `cd newCARTADesktop`
3. `meteor npm install`
4. `meteor npm start`

Note: On CentOS7 and Fedora (and probably RedHat), libXScrnSaver must be installed; `sudo yum install libXScrnSaver`

---

### To package the Mac and Linux Electron Apps

1. Install the electron-packager: `npm install --save-dev electron-packager`
2. Create Mac App: `electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds`
3. Create Linux App: `electron-packager . --overwrite --asar=true --platform=linux --arch=x64 --icon=carta_logo_v2.png --prune=true --out=release-builds`

The packaged apps can be found in the `newCARTADeskto/release-builds` directory.

---

### Note: This is work in progress. Here is an incomplete list of things to do:

1. Docker and X11 can be problematic, particularly on Linux. Sometimes there can be errors such as `QXcbConnection: Could not connect to display`. I think setting `-e DISPLAY=$DISPLAY` and running `xhost +` at first helps in most cases, but I'm still investigating a guaranteed way for it to work everytime. On Mac, I think `-e DISPLAY=docker.for.mac.host.internal:0` will work every time, but still need to do more testing.
2. If possible, get the App to install Docker and download the image if not already present.
3. Currently there is a fixed pause (child_process.execSync("sleep 45")) after clicking Local Mode in order to give the docker image time to start up. This could be improved by having it monitoring the output log and waiting until `websocket onopen done` comes up before continuing.
4. Reduce size of the docker image. It is currently quite large at 2.79GB. Hopefully it will be possible to strip out uneeded files to reduce the size.
5. Currently some sample images are supplied in the docker image. Instead, it should mount a user's local directory so they can open their own images. This is easy to do in the docker run command with an extra -v flag; `-v <absolute path to local directory>:<absolute path to directory in docker image>`

Your comments and suggestions are welcome.

---

#### Links for Reference

https://electronjs.org/

https://www.meteor.com/

https://www.docker.com/

https://github.com/CARTAvis

https://github.com/CARTAvis/newCARTAMeteorApp

https://www.christianengvall.se/electron-packager-tutorial/

