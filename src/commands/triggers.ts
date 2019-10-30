const fs = require("fs");
const globby = require("globby");

async function renderIndex(
  location: string,
  importStr: string,
  exportStr: string
) {
  return new Promise(async (resolve, reject) => {
    fs.readFile(
      "./templates/firebaseFunctionsIndex.hbs",
      "utf8",
      async (_err: any, data: any) => {
        try {
          await writeData(
            location,
            data
              .replace(/{{imports}}/g, importStr)
              .replace(/{{exports}}/g, exportStr)
          );
          resolve();
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

async function writeData(filename: string, data: any) {
  return new Promise(async (resolve, reject) => {
    fs.readFile(filename, (err: any) => {
      if (err) {
        console.log("Error ensuring file exists!");
        reject();
      }

      fs.writeFileSync(filename, data);
      resolve({ filename });
    });
  });
}

export default async () => {
  let importStr = ``;
  let exportStr = ``;

  const files = await globby(`./src/triggers/**/*.ts`);
  for (const file of files) {
    const pathParts = file.split("/");
    const triggerName = pathParts[pathParts.length - 1].split(".")[0];
    importStr += `const ${triggerName}_1 = require("./triggers/${triggerName}");`;
    exportStr += `${triggerName}: ${triggerName}_1.default,`;
  }
  try {
    await renderIndex("./dist/index.js", importStr, exportStr);
  } catch (error) {
    console.log(error);
  }

  console.log(
    `Rendered Firebase Functions index file with ${files.length} triggers...`
  );
};
