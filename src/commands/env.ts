import * as fs from "fs";
const globby = require("globby");

const currentEnv = process.argv[3] ? process.argv[3] : "local";

export default async () => {
  const files = await globby(`./env/${currentEnv}/**/*.*`);
  console.log(
    `Running ${currentEnv} environment setup by copying ${files.length} files...`
  );
  for (const file of files) {
    fs.copyFileSync(
      file,
      process.cwd() +
        "/" +
        file
          .split("/")
          .filter((_part, index) => index > 2)
          .join("/")
    );
  }
};
