dotnet publish -c Release
docker stop $(docker ps -a -q --filter ancestor=jcinfo-backend)
docker rmi jcinfo-backend
docker build --tag jcinfo-backend .
docker run --rm -dt -p 127.0.0.1:5000:80 jcinfo-backend jcinfo-backend
