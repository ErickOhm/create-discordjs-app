#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const child_process = require("child_process")

const QUESTIONS = [
  {
    name: "project-name",
    type: "input",
    message: "Project name:",
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else
        return "Project name may only include letters, numbers, underscores and hashes.";
    },
  },
  {
    name: "bot-token",
    type: "password",
    message: "Bot token:",
  },
  {
    name: "bot-prefix",
    type: "input",
    message: "Bot prefix:",
  },
];
const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = "cda";
  const projectName = answers["project-name"];
  const botToken = answers["bot-token"];
  const botPrefix = answers["bot-prefix"];
  const templatePath = `${__dirname}/templates/${projectChoice}`;

  fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  createDirectoryContents(templatePath, projectName);
  const content = `BOT_TOKEN=${botToken}\nPREFIX=${botPrefix}`;
  const writePath = `${CURR_DIR}/${projectName}/.env`;
      fs.writeFileSync(writePath, content, "utf8");
  console.log('Installing dependencies...')
  child_process.execSync(`cd ${projectName} && npm i`);
  const success = `
    Success! Created ${projectName} at ${CURR_DIR}/${projectName}
  `;
  const info = `
    Inside that directory you can run:
      * npm start: Runs the bot with pm2
      * npm run node: Runs the bot using node
      * npm run stop: Stops pm2
  `;
  console.log(success);
  console.log(info);
});

function createDirectoryContents(
  templatePath,
  newProjectPath,
) {
  const filesToCreate = fs.readdirSync(templatePath);
  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      if (file === ".npmignore") file = ".gitignore";
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
      // recursive call
      createDirectoryContents(
        `${templatePath}/${file}`,
        `${newProjectPath}/${file}`
      );
    }
  });
}
