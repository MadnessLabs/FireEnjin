const fs = require("fs");
const globby = require("globby");
const pluralize = require("pluralize");

async function renderToFile(
  templateName: string,
  location: string,
  dataFilter: (data) => string
) {
  return new Promise(async (resolve, reject) => {
    fs.readFile(
      `${__dirname}/../../templates/${templateName}.hbs`,
      "utf8",
      async (_err: any, data: any) => {
        try {
          fs.writeFileSync(location, dataFilter(data));
          resolve();
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

function capitalize (s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function replaceModelName (data, modelName) {
  return data
    .replace(/{{pascalCase modelName}}/g, capitalize(modelName))
    .replace(/{{camelCase modelName}}/g, modelName);
}

export default async () => {
  let importStr = ``;
  let exportStr = ``;
  const triggers: string[] = [];
  const schema = require(`${process.cwd()}/dist/graphql.schema.json`);
  let triggerCount = 0;
  for(const gqlType of schema.__schema.types) {
    if (["Query", "Mutation"].indexOf(gqlType.name) === -1) continue; 
    gqlType.fields.map(async field => {
      if (gqlType.name === 'Query' && field.type.kind === "OBJECT") {
        try {
          await renderToFile(
            "firebaseFunctionFind", 
            `./dist/triggers/${field.name}.js`, 
            (data) => replaceModelName(data, field.name)
          );
        } catch (e) {
          triggerCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === 'Query' && field.type.kind === "LIST") {
        try {
          await renderToFile(
            "firebaseFunctionList", 
            `./dist/triggers/${field.name}.js`, 
            (data) => replaceModelName(data, pluralize.singular(field.name))
          );
        } catch (e) {
          triggerCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === 'Mutation' && field.name.startsWith('add')) {
        try {
          await renderToFile(
            "firebaseFunctionAdd", 
            `./dist/triggers/${field.name}.js`, 
            (data) => replaceModelName(data, pluralize.singular(field.name.slice(3)))
          );
        } catch (e) {
          triggerCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === 'Mutation' && field.name.startsWith('edit')) {
        try {
          await renderToFile(
            "firebaseFunctionEdit", 
            `./dist/triggers/${field.name}.js`, 
            (data) => replaceModelName(data, pluralize.singular(field.name.slice(4)))
          );
        } catch (e) {
          triggerCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === 'Mutation' && field.name.startsWith('delete')) {
        try {
          await renderToFile(
            "firebaseFunctionDelete", 
            `./dist/triggers/${field.name}.js`, 
            (data) => replaceModelName(data, pluralize.singular(field.name.slice(5)))
          );
        } catch (e) {
          triggerCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      }
      triggers.push(field.name)
    });
  }
  for(const file of await globby(`./src/triggers/**/*.ts`)) {
    const pathParts = file.split("/");
    triggers.push(pathParts[pathParts.length - 1].split(".")[0]);
  }
  for(const trigger of triggers) {
    importStr += `const ${trigger}_1 = require("./triggers/${trigger}");`;
    exportStr += `${trigger}: ${trigger}_1.default,`;
  }
  try {
    await renderToFile("firebaseFunctionsIndex", "./dist/index.js", (data) => data
    .replace(/{{imports}}/g, importStr)
    .replace(/{{exports}}/g, exportStr));
  } catch (e) {
    console.log("Error rendering firebase functions index... ", e);
  }

  console.log(
    `Rendered Firebase Functions index file with ${triggers.length + triggerCount} triggers...`
  );
};
