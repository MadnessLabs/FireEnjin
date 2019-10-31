const util = require("util");
const exec = util.promisify(require("child_process").exec);

export default async () => {
  const { stdout, stderr } = await exec(`npm run g:${process.argv[3]}`);
  console.log(stdout, stderr);
};
