import * as fg from "fast-glob";
import { exec } from 'child_process';

export default async () => {
  const entries = fg.sync(['src/**/*.presets.ts']); 
  const command = `tsc ${entries.join(" ")} --out ${process.argv[3] && process.argv[3] !== "watch" ? process.argv[3] : "www/presets.js"} --module amd ${process.argv[3] === 'watch' || process.argv[4] === 'watch' ? '--watch' : ""}`;

  exec(command, function(error, stdout, stderr) {
      if (error !== null) {
          console.log('exec error: ' + error, stderr);
      }
      console.log('Completed rendering presets...')
  });
};
