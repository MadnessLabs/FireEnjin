const pluralize = require("pluralize");
const package = require(`${process.env.enjinProjectDir}/package.json`);
const hasStorybook = Object.keys(package.devDependencies).includes(
  "@storybook/html"
);
const enjinSettings = package.enjin ? package.enjin : {};

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
  plop.setGenerator("endpoint", {
    description:
      "A new unit (with input & output), resolver, query, and http trigger",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new endpoint"
      },
      {
        type: "input",
        name: "description",
        message: "A description of what this endpoint is used for"
      }
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{camelCase name}}/{{camelCase name}}.input.ts`,
        templateFile: `${__dirname}/templates/input.hbs`
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{camelCase name}}/{{camelCase name}}.output.ts`,
        templateFile: `${__dirname}/templates/output.hbs`
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{camelCase name}}/{{camelCase name}}.test.ts`,
        templateFile: `${__dirname}/templates/unit-test.hbs`
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{camelCase name}}/{{camelCase name}}.ts`,
        templateFile: `${__dirname}/templates/unit.hbs`
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/resolvers/{{pascalCase name}}.ts`,
        templateFile: `${__dirname}/templates/resolver.hbs`
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/triggers/{{camelCase name}}.ts`,
        templateFile: `${__dirname}/templates/trigger-https.hbs`
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/queries/{{camelCase name}}.gql`,
        templateFile: `${__dirname}/templates/query-write.hbs`
      }
    ]
  });
  plop.setGenerator("resolver", {
    description: "A new resolver for GraphQL",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new resolver"
      },
      {
        type: "input",
        name: "description",
        message: "A description of what this resolver is used for"
      }
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/resolvers/{{pascalCase name}}.ts`,
        templateFile: `${__dirname}/templates/resolver.hbs`
      }
    ]
  });
  plop.setGenerator("trigger", {
    description: "A new trigger for Firebase Functions",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new trigger"
      },
      {
        type: "input",
        name: "description",
        message: "A description of what this trigger is used for"
      }
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/triggers/{{camelCase name}}.ts`,
        templateFile: `${__dirname}/templates/trigger.hbs`
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
  const componentProps = [
    {
      type: "input",
      name: "name",
      message: "The name of the new component"
    }
  ];
  const handlebarsData = {};
  if (!enjinSettings.namespace) {
    componentProps.push({
      type: "input",
      name: "namespace",
      message: "The namespace of the component",
      filter: data => {
        return !data || data === ""
          ? ""
          : data.replace(" ", "-").toLowerCase() + "-";
      }
    });
  } else {
    handlebarsData.namespace =
      handlebarsData.namespace === ""
        ? ""
        : enjinSettings.namespace.replace(" ", "-").toLowerCase() + "-";
  }
  const componentActions = [
    {
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.tsx`,
      templateFile: `${__dirname}/templates/component-tsx.hbs`,
      data: handlebarsData
    },
    {
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.css`,
      templateFile: `${__dirname}/templates/component-css.hbs`,
      data: handlebarsData
    },
    {
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.e2e.ts`,
      templateFile: `${__dirname}/templates/component-e2e.hbs`,
      data: handlebarsData
    },
    {
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.spec.ts`,
      templateFile: `${__dirname}/templates/component-spec.hbs`,
      data: handlebarsData
    }
  ];
  if (hasStorybook) {
    componentActions.push({
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.stories.js`,
      templateFile: `${__dirname}/templates/component-stories.hbs`,
      data: handlebarsData
    });
  }
  plop.setGenerator("component", {
    description: "Create a new web component",
    prompts: componentProps,
    actions: componentActions
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
