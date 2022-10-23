cd /opt/jcinfo/backend

echo "*** dotnet publish -c Release"
dotnet publish -c Release

runningDockerProcess=$(docker ps -a -q --filter ancestor=jcinfo-backend)
# if Non-zero-length string, then...
if [ -n "$runningDockerProcess" ]; then
    docker stop "$runningDockerProcess"
else
    echo ""
    echo "*** No Docker process is running with the jcinfo-backend image."
    echo ""
fi

# remove old image
echo "*** docker rmi jcinfo-backend"
docker rmi jcinfo-backend

# build new image
echo "*** docker build --tag jcinfo-backend ."
docker build --tag jcinfo-backend .

# start image as a process
echo "*** docker run ... jcinfo-backend"
# Parameters:
#   --rm=delete when stopped
#   -d=detached
#   -t=tail logs
#   -p=port
#   --env-file=file containing environment variables to be available in container
#   --name=process name
#   (positional)<image-name>
docker run --rm -dt -p 127.0.0.1:5000:80 \
--env-file /root/env.list \
--name jcinfo-backend jcinfo-backend
# To view processes: docker ps -a
# To follow/tail logs: docker logs -f <process-name>