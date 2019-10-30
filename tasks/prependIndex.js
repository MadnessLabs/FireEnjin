const fs = require("fs-extra");

(async () => {
  for (const indexPage of ["index.js", "index.esm.js"]) {
    var indexFilePath = `${process.cwd()}/dist/${indexPage}`;
    var indexFile = fs.readFileSync(indexFilePath, "utf8");
    fs.writeFileSync(
      indexFilePath,
      `#! /usr/bin/env node
    
${indexFile}`
    );
  }
})().catch(err => console.log(err));
