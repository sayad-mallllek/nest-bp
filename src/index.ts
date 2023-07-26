#! /usr/bin/env node

import figlet from "figlet";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";
import { ProjectPromptType } from "./index.types";

const program = new Command();

// const options = program.opts();

const PACKAGE_MANAGER_COMMANDS = {
    npm: {
        install: "npm install",
    },
    yarn: {
        install: "yarn install",
    },
    pnpm: {
        install: "pnpm install",
    },
}

console.log(figlet.textSync("Dir Manager"));

async function listDirContents(filepath: string) {
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file: string) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });
        // add the following
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}

function createDir(filepath: string) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
        console.log("The directory has been created successfully");
    }
}

function createFile(filepath: string) {
    fs.openSync(filepath, "w");
    console.log("An empty file has been created");
}

const receiver = async () => {

    const project: ProjectPromptType = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of your project?",
            suffix: " (Leave a blank if you want to install in the current directory)",
        },
        {
            type: "list",
            name: "action",
            message: "What do you want to do?",
            choices: ["create a new project", "create a new file", "create a new directory", "list directory contents"],
        },
        {
            type: "list",
            name: "action",
            message: "Do you want to integrate it with AWS?",
            choices: ["yes", "no"],
            default: "yes"
        },
    ]);

    // if (projectName.name) createDir(projectName.name);

    // execSync('npx degit https://github.com/sayad-mallllek/nestjs-template-with-aws.git -y --force ');
    // execSync(`${PACKAGE_MANAGER_COMMANDS[packageManager.action].install}`);


}

program
    .version("1.0.0")
    .action(receiver)
    .parse(process.argv);
