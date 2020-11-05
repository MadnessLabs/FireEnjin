import  Git from "nodegit";
import inquirer from "inquirer";
import path from "path";
import rimraf from "rimraf";
import { exec } from 'child_process';

const runCommand = (command: string, options: any = null) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
};

export default async () => {
  let defaultNamespace = true;
  const results: any = {
    repos: []
  };
    const pathParts = process.cwd().split(path.sep);
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'namespace',
        message: "What's your app's namespace?",
        default: function () {
          return process?.argv[3] ? process.argv[3] : pathParts[pathParts.length - 1];
        },
        validate: function(answer) {
          if (answer !== pathParts[pathParts.length - 1]) {
            defaultNamespace = false;
          }
          
          return true;
        }
      },
      {
        type: 'input',
        name: 'organization',
        message: "What's your organization name?",
      },
      {
        type: 'checkbox',
        message: 'Select Project Needs',
        name: 'repos',
        choices: [
          {
            name: 'App',
            checked: true
          },
          {
            name: 'Backend',
            checked: true
          },
          {
            name: 'Components',
            checked: true
          },
        ],
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one for your project.';
          }
  
          return true;
        },
      },
    ]);

    if (answers) {
      if (answers?.repos?.includes("App")) {
        console.log("Cloning App Repo...");
        const appDir = `${!defaultNamespace ? answers.namespace + "/" : ""}app`;
        results.repos.push(await Git.Clone("https://github.com/madnesslabs/fireenjin-app.git", appDir));
        await rimraf.sync(`${appDir}/.git`);
        console.log("Installing App Dependencies...");
        await runCommand(`npm install`, { cwd: appDir });
        console.log("Setting Up App GIT and Making Initial Commit...");
        await runCommand(`git init`, { cwd: appDir });
        await runCommand(`git add .`, { cwd: appDir });
        await runCommand(`git commit -m "Initial Commit"`, { cwd: appDir });
      }
      if (answers?.repos?.includes("Backend")) {
        console.log("Cloning Backend Repo...");
        const backendDir = `${!defaultNamespace ? answers.namespace + "/" : ""}backend`;
        results.repos.push(await Git.Clone("https://github.com/madnesslabs/fireenjin-backend.git", backendDir));
        await rimraf.sync(`${backendDir}/.git`);
        console.log("Installing Backend Dependencies...");
        await runCommand(`npm install`, { cwd: backendDir });
        console.log("Setting Up Backend GIT and Making Initial Commit...");
        await runCommand(`git init`, { cwd: backendDir });
        await runCommand(`git add .`, { cwd: backendDir });
        await runCommand(`git commit -m "Initial Commit"`, { cwd: backendDir });
      }
      if (answers?.repos?.includes("Components")) {
        console.log("Cloning Components Repo...");
        const componentsDir = `${!defaultNamespace ? answers.namespace + "/" : ""}components`;
        results.repos.push(await Git.Clone("https://github.com/madnesslabs/fireenjin-components.git", componentsDir));
        await rimraf.sync(`${componentsDir}/.git`);
        console.log("Installing Components Dependencies...");
        await runCommand(`npm install`, { cwd: componentsDir });
        console.log("Setting Up Components GIT and Making Initial Commit...");
        await runCommand(`git init`, { cwd: componentsDir });
        await runCommand(`git add .`, { cwd: componentsDir });
        await runCommand(`git commit -m "Initial Commit"`, { cwd: componentsDir });
      }
    }
    

    return results;
}