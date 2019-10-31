import * as fs from "fs";
import triggersCommand from "./commands/triggers";
import cloneSeedCommand from "./commands/cloneSeed";
import envCommand from "./commands/env";
import generateCommand from "./commands/generate";
import migrateCommand from "./commands/migrate";
import runSeedCommand from "./commands/runSeed";

const enjinDir = __dirname;

if (process.argv.length > 2) {
  if (process.argv[2] === "triggers") {
    triggersCommand();
  } else if (process.argv[2] === "generate") {
    generateCommand();
  } else if (process.argv[2] === "seed:clone") {
    cloneSeedCommand();
  } else if (process.argv[2] === "seed") {
    runSeedCommand();
  } else if (process.argv[2] === "env") {
    envCommand();
  } else if (process.argv[2] === "migrate") {
    migrateCommand();
  } else {
    console.log(`${process.argv[2]} command doesn't exist!`);
  }
} else {
  const docs = fs.readFileSync(enjinDir + "/README.md", "utf8");
  console.log(docs);
}
