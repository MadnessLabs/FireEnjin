const { spawn } = require("child_process");
const path = require("path");

export default async () => {
  process.env.enjinProjectDir = process.cwd();
  spawn(
    /^win/.test(process.platform) ? "npm.cmd" : "npm",
    ["run", "plop", process.argv[3], `--prefix=${__dirname}/../../`],
    { stdio: "inherit", cwd: process.cwd() }
  );
};
