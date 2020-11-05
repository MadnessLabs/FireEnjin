import  Git from "nodegit";
import inquirer from "inquirer";
import path from "path";
import rimraf from "rimraf";

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
          if (answer !== path.dirname(process.cwd()).split(path.sep).pop()) {
            defaultNamespace = false;
          }
          
          return true;
        }
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
        results.repos.push(await Git.Clone("https://github.com/madnesslabs/fireenjin-app.git", `${!defaultNamespace ? answers.namespace + "/" : ""}app`));
        await rimraf.sync(`${!defaultNamespace ? answers.namespace + "/" : ""}app/.git`);
      }
      if (answers?.repos?.includes("Backend")) {
        results.repos.push(await Git.Clone("https://github.com/madnesslabs/fireenjin-backend.git", `${!defaultNamespace ? answers.namespace + "/" : ""}backend`));
        await rimraf.sync(`${!defaultNamespace ? answers.namespace + "/" : ""}backend/.git`);
      }
      if (answers?.repos?.includes("Components")) {
        results.repos.push(await Git.Clone("https://github.com/madnesslabs/fireenjin-components.git", `${!defaultNamespace ? answers.namespace + "/" : ""}components`));
        await rimraf.sync(`${!defaultNamespace ? answers.namespace + "/" : ""}components/.git`);
      }
    }
    

    return results;
}