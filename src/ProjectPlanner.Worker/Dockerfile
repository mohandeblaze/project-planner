# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0.101-alpine3.19 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ProjectPlanner.Worker/ProjectPlanner.Worker.csproj", "ProjectPlanner.Worker/"]
COPY ["ProjectPlanner.Shared/ProjectPlanner.Shared.csproj", "ProjectPlanner.Shared/"]
RUN dotnet restore "ProjectPlanner.Worker/ProjectPlanner.Worker.csproj"
COPY . .
WORKDIR "/src/ProjectPlanner.Worker"
RUN dotnet build "ProjectPlanner.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 2: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ProjectPlanner.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0.1-alpine3.19 AS final
ENV APP_UID=1654
ENV ASPNETCORE_URLS=http://+:80
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_VERSION=8.0.100
ENV ASPNET_VERSION=8.0.100
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=true

# Install PostgreSQL client tools
RUN apk --no-cache add postgresql-client

# Create the /database_backup folder and ensure the user has write permissions
USER root
RUN mkdir /pg_data_backup && chown $APP_UID /pg_data_backup
USER $APP_UID

WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "ProjectPlanner.Worker.dll"]
