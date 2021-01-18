import * as fg from "fast-glob";
import { exec } from 'child_process';

export default async () => {
  const entries = fg.sync(['src/**/*.presets.ts']); 
  const command = `tsc ${entries.join(" ")} --out ${process.argv[2] ? process.argv[2] : "www/presets.js"} --module amd ${process.argv[3] === 'watch' ? '--watch' : ""}`;

  exec(command, function(error, stdout, stderr) {
      if (error !== null) {
          console.log('exec error: ' + error, stderr);
      }
      console.log('Completed rendering presets...')
  });
};
