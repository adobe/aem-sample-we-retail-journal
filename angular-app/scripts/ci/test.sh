# IP is required as docker container is separated completely and therefor host or IP of host-system has to be provided (instead of localhost)
export IP=${IP:=`hostname`}

# Get selenium-standalone via Docker
docker pull vvoyer/selenium-standalone:latest
docker run --name sel-standalone -d --rm -p 4444:4444 vvoyer/selenium-standalone:latest

# Cool down to let Selenium grid be fully ready
sleep 20

# Execute tests
npm run ci

TEST_RESULT_CODE=$?

# Stop Selenium grid
docker stop sel-standalone

exit $TEST_RESULT_CODE
