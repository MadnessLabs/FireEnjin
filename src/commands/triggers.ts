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

function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function camelize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function replaceModelName(data, modelName) {
  return data
    .replace(/{{pascalCase modelName}}/g, capitalize(modelName))
    .replace(/{{camelCase modelName}}/g, modelName);
}

export default async () => {
  let importStr = ``;
  let exportStr = ``;
  let endpointStr = ``;
  const triggers: string[] = [];
  const endpoints: string[] = [];
  const models: any = {};
  let endpointCount = 0;
  const schema = require(`${process.cwd()}/dist/graphql.schema.json`);

  // CREATE IMPORT AND EXPORT STRINGS FOR TRIGGERS
  for (const file of await globby(`./src/triggers/**/*.ts`)) {
    // const triggerFile = fs.readFileSync(file, "utf8");
    const pathParts = file.split("/");
    const triggerName = pathParts[pathParts.length - 1].split(".")[0];
    importStr += `const ${triggerName} = require("./triggers/${triggerName}");\n`;
    exportStr += `  ${triggerName}: ${triggerName}.default,\n`;
    triggers.push(triggerName);
  }

  // CREATE API ENDPOINTS FROM GRAPHQL SCHEMA
  for (const gqlType of schema.__schema.types) {
    if (["Query", "Mutation"].indexOf(gqlType.name) === -1) continue;
    for (const field of gqlType.fields) {
      if (endpoints.indexOf(field.name) >= 0) continue;
      if (gqlType.name === "Query" && field.type.kind === "OBJECT") {
        try {
          // await renderToFile(
          //   "firebaseFunctionFind",
          //   `./dist/triggers/${field.name}.js`,
          //   data => replaceModelName(data, field.name)
          // );
          const modelName = capitalize(field.name);
          models[modelName] = true;
          endpointStr += `app.get("/${camelize(
            modelName
          )}/:id", async (req, res) => res.send(cleanData(await new ${modelName}.${modelName}Model().find(req.params.id))));\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === "Query" && field.type.kind === "LIST") {
        try {
          // await renderToFile(
          //   "firebaseFunctionList",
          //   `./dist/triggers/${field.name}.js`,
          //   data => replaceModelName(data, pluralize.singular(field.name))
          // );
          const modelName = capitalize(pluralize.singular(field.name));
          models[modelName] = true;
          endpointStr += `app.get("/${camelize(
            modelName
          )}", async (req, res) => res.send(cleanData(await new ${modelName}.${modelName}Model().limit(req.params.limit ? req.params.limit : 15).find())));\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === "Mutation" && field.name.startsWith("add")) {
        try {
          // await renderToFile(
          //   "firebaseFunctionAdd",
          //   `./dist/triggers/${field.name}.js`,
          //   data =>
          //     replaceModelName(data, field.name.slice(3))
          // );
          const modelName = capitalize(field.name.slice(3));
          models[modelName] = true;
          endpointStr += `app.post("/${camelize(
            modelName
          )}", async (req, res) => res.send(cleanData(await new ${modelName}.${modelName}Model().create(req.body))));\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === "Mutation" && field.name.startsWith("edit")) {
        try {
          // await renderToFile(
          //   "firebaseFunctionEdit",
          //   `./dist/triggers/${field.name}.js`,
          //   data =>
          //     replaceModelName(data, field.name.slice(4))
          // );
          const modelName = capitalize(field.name.slice(4));
          models[modelName] = true;
          endpointStr += `app.post("/${camelize(
            modelName
          )}/:id", async (req, res) => res.send(cleanData(await new ${modelName}.${modelName}Model().create(req.body))));\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (
        gqlType.name === "Mutation" &&
        field.name.startsWith("delete")
      ) {
        try {
          // await renderToFile(
          //   "firebaseFunctionDelete",
          //   `./dist/triggers/${field.name}.js`,
          //   data =>
          //     replaceModelName(data, field.name.slice(6))
          // );
          const modelName = capitalize(field.name.slice(6));
          models[modelName] = true;
          endpointStr += `app.delete("/${camelize(
            modelName
          )}/:id", async (req, res) => res.send(cleanData(await new ${modelName}.${modelName}Model().delete(req.params.id))));\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      }
      endpoints.push(field.name);
    }
  }

  for (const modelName of Object.keys(models)) {
    importStr += `const ${modelName} = require("./models/${modelName}");\n`;
  }

  try {
    await renderToFile("firebaseFunctionsIndex", "./dist/index.js", data =>
      data
        .replace(/{{imports}}/g, importStr)
        .replace(/{{exports}}/g, exportStr)
        .replace(/{{endpoints}}/g, endpointStr)
    );
  } catch (e) {
    console.log("Error rendering firebase functions index... ", e);
  }

  console.log(
    `Rendered Firebase Functions index file with ${triggers.length +
      1} triggers and ${endpointCount + endpoints.length} api endpoints...`
  );
};
