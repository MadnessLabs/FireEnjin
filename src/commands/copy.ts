import * as fs from "fs";

export default async () => {
  fs.copyFile(process.argv[3], process.argv[4], err => {
    if (err) throw err;

    console.log("source.txt was copied to destination.txt");
  });
};
