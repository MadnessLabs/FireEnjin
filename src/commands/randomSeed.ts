const fs = require("fs");
const prettier = require("prettier");
const readline = require("readline");
const yargs = require("yargs").default("dir", `${process.cwd()}/src/seeds`)
  .argv;
const pluralize = require("pluralize");
const faker = require('faker');

export default async () => {

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
            resolve(data);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }
  
  const collectionName: string = yargs._[1] ? yargs._[1].toLowerCase() : null;
  const seedCount = yargs.count ? yargs.count : yargs._[2] ? yargs._[2] : null;
  let seedsClonedCount = 0;
  const overwrite = yargs.o || yargs.overwrite || false;
  const seedDir = yargs.dir;

  if (!collectionName && seedDir === `${process.cwd()}/src/seeds`) {
    console.log("Collection name is required to add a seed!");
    return false;
  }

  const schema = require(`${process.cwd()}/dist/graphql.schema.json`);
  for (const gqlType of schema.__schema.types as {kind: string; name: string; fields: any[]}[]) {
    if (gqlType.kind !== "OBJECT" || gqlType.name.toLowerCase() !== pluralize.singular(collectionName).toLowerCase()) continue;
    for (const field of gqlType.fields) {
      if (field.type.kind !== "SCALAR") continue;
      console.log(field.name, field.type.name, faker.fake('{{name.firstName}}'));
    }
  }

  console.log(`${seedsClonedCount} seeds cloned successfully!`);
};
