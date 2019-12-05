const pluralize = require("pluralize");

function dateStringToYMD(str) {
  const d = str ? new Date(Date.parse(str)) : new Date();

  return (
    d.getFullYear() +
    "-" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + d.getDate()).slice(-2)
  );
}

function dateStringToYMDHIS(str) {
  const d = str ? new Date(Date.parse(str)) : new Date();

  return (
    d.getFullYear() +
    "-" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + d.getDate()).slice(-2) +
    "_" +
    ("00" + d.getHours()).slice(-2) +
    "-" +
    ("00" + d.getMinutes()).slice(-2) +
    "-" +
    ("00" + d.getSeconds()).slice(-2)
  );
}

module.exports = function(plop) {
  process.env.enjinProjectDir = process.env.enjinProjectDir
    ? process.env.enjinProjectDir
    : process.cwd();
  plop.setHelper("plural", txt => pluralize(txt));
  plop.setGenerator("input", {
    description: "define data structure of an input",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new input"
      },
      {
        type: "input",
        name: "description",
        message: "A description of what this input is used for"
      }
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/inputs/{{camelCase name}}.ts`,
        templateFile: `${__dirname}/templates/input.hbs`
      }
    ]
  });
  plop.setGenerator("migration", {
    description:
      "A task that will run once per environment and save the results",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the migration"
      }
    ],
    actions: [
      {
        type: "add",
        path: `${
          process.env.enjinProjectDir
        }/src/migrations/${dateStringToYMD()}_{{camelCase name}}.ts`,
        templateFile: `${__dirname}/templates/migration.hbs`
      }
    ]
  });
  plop.setGenerator("model", {
    description: "Define data structure and relationships",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new model"
      }
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/models/{{pascalCase name}}.ts`,
        templateFile: `${__dirname}/templates/model.hbs`
      }
    ]
  });
  plop.setGenerator("query", {
    description: "A query to get or modify data used for codegen",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the query"
      },
      {
        type: "input",
        name: "type",
        message: "The type of query",
        choices: ["read", "write"],
        default: "read"
      }
    ],
    actions: data => [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/queries/{{camelCase name}}.gql`,
        templateFile: `${__dirname}/templates/query-${data.type}.hbs`
      }
    ]
  });
  plop.setGenerator("unit", {
    description: "A unit of functionality",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new unit of functionality"
      },
      {
        type: "input",
        name: "description",
        message: "The description of what the new unit of functionality does"
      }
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{camelCase name}}/{{camelCase name}}.ts`,
        templateFile: `${__dirname}/templates/unit.hbs`
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{camelCase name}}/{{camelCase name}}.test.ts`,
        templateFile: `${__dirname}/templates/unit-test.hbs`
      }
    ]
  });
};
