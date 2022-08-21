# docker image to use as template (from https://hub.docker.com/_/microsoft-dotnet)
FROM mcr.microsoft.com/dotnet/aspnet:6.0
# AS build-env
# working directory in OS's file system
# WORKDIR /jcinfo

# Copy csproj and restore as distinct layers
# COPY /JCInfo-Backend/*.csproj ./
# RUN dotnet restore

# Copy everything else and build
# COPY ../engine/examples ./
# RUN dotnet publish -c Release -o out

# Build runtime image
# FROM mcr.microsoft.com/dotnet/aspnet:6.0
# WORKDIR /jcinfo
# COPY --from=build-env /jcinfo/out .
# ENTRYPOINT ["dotnet", "JCInfo-Backend.dll"]

# copy from OS's "publish" directory into container's "App" directory
COPY bin/Release/net6.0/publish/ app/
# working directory inside container
WORKDIR /app
# add security by disabling the diagnostic pipeline, allowing container to run as readonly
# https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-environment-variables
ENV DOTNET_EnableDiagnostics=0
ENTRYPOINT ["dotnet", "backend.dll"]
