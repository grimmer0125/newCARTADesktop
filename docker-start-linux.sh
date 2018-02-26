echo "Running the docker-start-linux.sh script"
echo "\$DISPLAY is" $DISPLAY
docker run -p 3000:3000 -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix  ajmasiaa/newcarta_meteor_v2 /start.sh
~  
