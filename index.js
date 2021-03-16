#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const child_process = require("child_process");

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
    name: "author",
    type: "input",
    message: "Author:",
  },
  {
    name: "license",
    type: "input",
    message: "License:",
    default: 'ISC'
  },
  {
    name: "bot-prefix",
    type: "input",
    message: "Bot prefix:",
    default: '!'
  },
];
const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = "cda";
  const projectName = answers["project-name"];
  const license = answers["license"];
  const author = answers["author"];
  const botToken = 'BotTokenHere';
  const botPrefix = answers["bot-prefix"];
  const templatePath = `${__dirname}/templates/${projectChoice}`;

  const packageJson = `
  {
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "A simple discordjs bot",
    "main": "index.js",
    "scripts": {
      "start": "node index.js",
      "lint": "eslint ."
    },
    "keywords": [
      "discordjs",
      "bot"
    ],
    "author": "${author}",
    "license": "${license}",
    "dependencies": {
      "chalk": "^4.1.0",
      "discord.js": "^12.5.1",
      "dotenv": "^8.2.0",
      "eslint": "^7.21.0"
    }
  }
  `;

  fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  createDirectoryContents(templatePath, projectName);
  const content = `BOT_TOKEN=${botToken}\nPREFIX=${botPrefix}`;
  const envPath = `${CURR_DIR}/${projectName}/.env`;
  fs.writeFileSync(envPath, content, "utf8");
  const packagePath = `${CURR_DIR}/${projectName}/package.json`;
  fs.writeFileSync(packagePath, packageJson, "utf8");
  console.log("Installing dependencies...");
  child_process.execSync(`cd ${projectName} && npm i`);
  const success = `
    Success! Created ${projectName} at ${CURR_DIR}/${projectName}
  `;
  const info = `
    Inside that directory you can run:
      * npm start: Runs the bot
      * npm run lint: Runs eslint
  `;
  const start = `
    To start: 
      * cd into ${projectName}
      * Add your bot token in the .env file
      * run npm start
  `;
  console.log(success);
  console.log(info);
  console.log(start);
});

function createDirectoryContents(templatePath, newProjectPath) {
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
