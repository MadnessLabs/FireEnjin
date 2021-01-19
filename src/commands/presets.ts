import * as fg from "fast-glob";
import { exec } from 'child_process';

export default async () => {
  const entries = fg.sync(['src/**/*.presets.ts']); 
  if (!entries?.length) throw new Error("No presets found...");
  const command = `tsc ${entries.join(" ")} --out ${process.argv[3] && process.argv[3] !== "watch" ? process.argv[3] : "www/presets.js"} --module amd ${process.argv[3] === 'watch' || process.argv[4] === 'watch' ? '--watch' : ""} --moduleResolution node`;

  exec(command, async function(error, stdout, stderr) {
      if (error !== null) {
          console.log('exec error: ' + error, stdout, stderr);
      }
      console.log('Completed rendering presets...')
  });
};
