FROM mcr.microsoft.com/dotnet/aspnet:8.0.1-alpine3.19 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0.101-alpine3.19 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ProjectPlanner.csproj", "./"]
RUN dotnet restore "ProjectPlanner.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "ProjectPlanner.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ProjectPlanner.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjectPlanner.dll"]
