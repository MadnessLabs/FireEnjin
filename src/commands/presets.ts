const globby = require("globby");
import { exec } from 'child_process';

export default async () => {
  const entries = await globby('src/**/*.presets.ts'); 
  if (!entries?.length) throw new Error("No presets found...");
  const command = `tsc ${[__dirname+'/presetsDefine.js', ...entries].join(" ")} --out ${process.argv[3] && process.argv[3] !== "watch" ? process.argv[3] : "www/presets.js"} --module amd ${process.argv[3] === 'watch' || process.argv[4] === 'watch' ? '--watch' : ""} --moduleResolution node --allowJs`;
  exec(command, async function(error, stdout, stderr) {
      if (error !== null) {
          console.log('exec error: ' + error, stdout, stderr);
      }
      console.log('Completed rendering presets...')
  });
};
