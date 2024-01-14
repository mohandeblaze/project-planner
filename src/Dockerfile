# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0.101-alpine3.19 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ProjectPlanner.csproj", "./"]
RUN dotnet restore "ProjectPlanner.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "ProjectPlanner.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 2: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ProjectPlanner.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0.1-alpine3.19 AS final
ENV APP_UID=1654
ENV ASPNETCORE_URLS=http://+:80
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_VERSION=8.0.100
ENV ASPNET_VERSION=8.0.100
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# ENV ASPNETCORE_HTTP_PORTS=8080
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=true

USER $APP_UID
WORKDIR /app
# EXPOSE 8080
# EXPOSE 8081
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjectPlanner.dll"]

# Docker run command (CMD not required if you want these values by default)
# CMD ["dotnet", "ProjectPlanner.dll"]
