const globby = require("globby");
const fbAdmin = require("firebase-admin");
const fs = require("fs");

export default async () => {
  const getDirectories = source =>
    fs
      .readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

  function connectDatabase() {
    const serviceAccountKey = JSON.parse(
      fs.readFileSync(`${process.cwd()}/service-account.json`, "utf8")
    );
    const project = serviceAccountKey.project_id;
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.cert(serviceAccountKey),
      databaseURL: `https://${project}.firebaseio.com`,
      storageBucket: `${project}.appspot.com`
    });

    return fbAdmin.firestore();
  }

  const env = require(`${process.cwd()}/environment.json`);

  let seedCount = 0;
  const seedGlob = (process.argv[3]
    ? process.argv[3]
    : env?.defaultSeeds
    ? env.defaultSeeds
    : getDirectories(`${process.cwd()}/dist/seeds`).join(",")
  )
    .split(",")
    .map(collection => `./dist/seeds/${collection}/**/*.js`);

  const files = await globby(seedGlob);
  const db = connectDatabase();
  if (env?.firestore?.emulate) {
    db.settings({
      host: env.firestore?.host ? env.firestore.host : "localhost:8080",
      ssl: !!env.firestore?.ssl
    });
  }
  for (const file of files) {
    const pathArr = file.split("/");
    let currentSeed = require(`${file.replace(
      "./",
      `${process.cwd()}/`
    )}`).default(db);
    currentSeed =
      typeof currentSeed.then === "function" ? await currentSeed : currentSeed;
    let isDocument = pathArr[4].indexOf(".") >= 0;
    let docRef = db
      .collection(pathArr[3])
      .doc(isDocument ? pathArr[4].split(".")[0] : pathArr[4]);

    if (!isDocument) {
      for (let i = 5; i < pathArr.length; i++) {
        isDocument = pathArr[i].indexOf(".") >= 0;
        docRef =
          isDocument || docRef.doc
            ? docRef.doc(isDocument ? pathArr[i].split(".")[0] : pathArr[i])
            : docRef.collection(pathArr[i]);
      }
    }

    await docRef.set(currentSeed);

    seedCount = seedCount + 1;
  }

  console.log(`${seedCount} seeds ran successfully!`);
};
