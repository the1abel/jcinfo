cd opt/jcinfo/backend

echo "*** dotnet publish -c Release"
dotnet publish -c Release

runningDockerProcess=$(docker ps -a -q --filter ancestor=jcinfo-backend)
# if Non-zero-length string, then...
if [ -n "$runningDockerProcess" ] then
    docker stop $runningDockerProcess
else
    echo ""
    echo "*** No Docker process is running with the jcinfo-backend image."
    echo ""
fi

echo "*** docker rmi jcinfo-backend"
docker rmi jcinfo-backend

echo "*** docker build --tag jcinfo-backend ."
docker build --tag jcinfo-backend .

echo "*** docker run --rm -dt -p 127.0.0.1:5000:80 jcinfo-backend jcinfo-backend"
docker run --rm -dt -p 127.0.0.1:5000:80 jcinfo-backend jcinfo-backend
