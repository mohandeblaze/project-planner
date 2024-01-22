#!/usr/bin/env node

// @ts-check
const { spawnSync } = require("child_process");
const { program } = require("commander");

const timestamp = new Date()
  .toISOString()
  .replace(/[-T:.Z]/g, "")
  .replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1.$2.$3.$4.$5.$6");

const AppDockerfile = "ProjectPlanner.App/Dockerfile";
const WorkerDockerfile = "ProjectPlanner.Worker/Dockerfile";
const AppRegistry = "mohandeblaze/project-planner";
const WorkerRegistry = "mohandeblaze/project-planner-worker";

program
  .command("build")
  .argument("<project>", "Specify the project to build (all, app, worker)")
  .option("-it, --ignore-timestamps", "Ignore timestamps when tagging images")
  .option("-l, --local", "Build local images instead of latest")
  .option("-p, --push", "Push images to registry")
  .action((project, options) => {
    console.info("project:", project);
    console.info("options:", options);

    buildImages({
      project,
      ignoreTimestamps: options.ignoreTimestamps,
      local: options.local,
      push: options.push,
    });
  });

program
  .command("pull")
  .argument("<project>", "Specify the project to pull (all, app, worker)")
  .action((project, options) => {
    console.info("project:", project);
    console.info("options:", options);

    pullImages({
      project,
    });
  });

program
  .command("stack")
  .argument("<action>", "Specify the action to perform (deploy, remove)")
  .action((action) => {
    if (action === "deploy") {
      deployStack();
    } else if (action === "remove") {
      removeStack();
    }
  });

program.parse(process.argv);

function removeStack() {
  const command = "docker";
  const args = ["stack rm project-planner-stack"];
  executeCommand(command, args);
}

function deployStack() {
  console.info("Deploying stack...");

  pullImages({
    project: "all",
  });

  const command = "docker";
  const args = [
    "stack deploy --compose-file docker-compose.yml project-planner-stack",
  ];
  executeCommand(command, args);
}

function pullImages({ project }) {
  const projects = {
    app: { image: AppDockerfile, registry: AppRegistry },
    worker: { image: WorkerDockerfile, registry: WorkerRegistry },
  };

  const projectKeys = project === "all" ? Object.keys(projects) : [project];

  if (!projectKeys.every((key) => key in projects)) {
    throw new Error(`Unknown project: ${project}`);
  }

  for (const key of projectKeys) {
    pullImage({
      image: projects[key].image,
      registry: projects[key].registry,
    });
  }
}

function pullImage({ image, registry }) {
  if (!image) {
    throw new Error("Image name is required");
  }

  const command = "docker";
  executeCommand(command, [`pull ${registry}:latest`]);
}

function buildImages({
  project,
  push,
  ignoreTimestamps = false,
  local = false,
}) {
  const projects = {
    app: { image: AppDockerfile, registry: AppRegistry },
    worker: { image: WorkerDockerfile, registry: WorkerRegistry },
  };

  const projectKeys = project === "all" ? Object.keys(projects) : [project];

  if (!projectKeys.every((key) => key in projects)) {
    throw new Error(`Unknown project: ${project}`);
  }

  for (const key of projectKeys) {
    buildImage({
      ignoreTimestamps,
      local,
      image: projects[key].image,
      registry: projects[key].registry,
    });
  }

  if (!local && push) {
    for (const key of projectKeys) {
      pushImage({
        ignoreTimestamps,
        image: projects[key].image,
        registry: projects[key].registry,
      });
    }
  }
}

function buildImage({
  image,
  registry,
  ignoreTimestamps = false,
  local = false,
}) {
  if (!image) {
    throw new Error("Image name is required");
  }

  const command = "docker";
  const buildArgs = [`build -f ${image} .`];

  if (local) {
    buildArgs.push(`-t ${registry}:local`);
  } else {
    buildArgs.push(`-t ${registry}:latest`);

    if (!ignoreTimestamps) {
      buildArgs.push(`-t ${registry}:${timestamp}`);
    }
  }

  executeCommand(command, buildArgs);
}

function pushImage({ image, registry, ignoreTimestamps = false }) {
  if (!image) {
    throw new Error("Image name is required");
  }

  const command = "docker";
  executeCommand(command, [`push ${registry}:latest`]);

  if (!ignoreTimestamps) {
    executeCommand(command, [`push ${registry}:${timestamp}`]);
  }
}

function executeCommand(command, args, ignoreError = false) {
  console.log();
  console.info(`> ${command} ${args.join(" ")}`);
  console.log();

  const childProcess = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
  });

  if (
    !ignoreError &&
    childProcess.status != null &&
    childProcess.status !== 0
  ) {
    process.exit(childProcess.status);
  }

  process.on("SIGTERM", () => {
    console.log("Received SIGTERM. Stopping the child process...");
    // @ts-ignore
    childProcess.kill("SIGTERM");
  });

  process.on("SIGINT", () => {
    console.log("Received SIGINT. Stopping the child process...");
    // @ts-ignore
    childProcess.kill("SIGINT");
  });
}
