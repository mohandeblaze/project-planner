# Set your environment variables
$env:PG_DB_PROJECT_PLANNER = $env:PG_DB_PROJECT_PLANNER
$env:PG_DB_PROJECT_PLANNER_USER = $env:PG_DB_PROJECT_PLANNER_USER
$env:PG_DB_PROJECT_PLANNER_PASSWORD = $env:PG_DB_PROJECT_PLANNER_PASSWORD
$TIMESTAMP = Get-Date -Format "yyyy.MM.dd.HH.mm.ss"
$env:TIMESTAMP = $TIMESTAMP

# current directory
$pwd = (Get-Location).Path

# Check the input parameter
if ($args[0] -eq "build") {
  # Run docker-compose build
  docker compose build

  # Push the built image to Docker Hub
  docker push "mohandeblaze/project-planner:latest"
  docker push "mohandeblaze/project-planner:$TIMESTAMP"
}
elseif ($args[0] -eq "up") {
  # Run docker-compose up
  docker compose up -d
}
else {
  Write-Host "Usage: $args[0] [build | up]"
}
