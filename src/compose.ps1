# Set your environment variables
$env:PG_DB_PROJECT_PLANNER = $env:PG_DB_PROJECT_PLANNER
$env:PG_DB_PROJECT_PLANNER_USER = $env:PG_DB_PROJECT_PLANNER_USER
$env:PG_DB_PROJECT_PLANNER_PASSWORD = $env:PG_DB_PROJECT_PLANNER_PASSWORD
$TIMESTAMP = Get-Date -Format "yyyy.MM.dd.HH.mm.ss"
$env:TIMESTAMP = $TIMESTAMP

# print current directory
Write-Host "Current directory: $pwd"
Write-Host "Timestamp: $TIMESTAMP"

function Build() {
  docker build -f ProjectPlanner.App/Dockerfile . -t "mohandeblaze/project-planner:latest" -t "mohandeblaze/project-planner:${TIMESTAMP}"
  docker build -f ProjectPlanner.Worker/Dockerfile . -t "mohandeblaze/project-planner-worker:latest" -t "mohandeblaze/project-planner-worker:${TIMESTAMP}"
}

function Push() {
  docker push "mohandeblaze/project-planner:latest"
  docker push "mohandeblaze/project-planner:$TIMESTAMP"
  docker push "mohandeblaze/project-planner-worker:latest"
  docker push "mohandeblaze/project-planner-worker:$TIMESTAMP"
}

function RemoveLocalImages() {
  docker image rm "mohandeblaze/project-planner:latest" -f
  docker image rm "mohandeblaze/project-planner:$TIMESTAMP" -f
  docker image rm "mohandeblaze/project-planner-worker:latest" -f
  docker image rm "mohandeblaze/project-planner-worker:$TIMESTAMP" -f
}

function Run() {
  docker compose up -d
  docker-compose ps
}

# Check the input parameter
if ($args[0] -eq "publish") {
  # build the image
  Build
  $exitCode = $LASTEXITCODE

  # Check if the build was successful
  if ($exitCode -eq 0) {
    Push
    $exitCode = $LASTEXITCODE

    # Check if the push was successful
    if ($exitCode -eq 0) {
      # Remove local images
      RemoveLocalImages
    }
  }
}
elseif ($args[0] -eq "build") {
  # build the image
  Build
}
elseif ($args[0] -eq "local") {
  # build the image
  Build
  $exitCode = $LASTEXITCODE

  if ($exitCode -eq 0) {
    Run
  }
}
elseif ($args[0] -eq "up") {
  Run
}
else {
  Write-Host "Usage: $args[0] [publish | local]"
}
