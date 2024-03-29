const globby = require("globby");
const admin = require("firebase-admin");
const fs = require("fs");

function connectDatabase() {
  const serviceAccountKey = JSON.parse(
    fs.readFileSync(`${process.cwd()}/service-account.json`, "utf8")
  );
  const project = serviceAccountKey.project_id;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: `https://${project}.firebaseio.com`,
    storageBucket: `${project}.appspot.com`,
  });

  return admin.firestore();
}

export default async () => {
  let migrationCount = 0;
  const dryRun = process.argv[3] && process.argv[3] === "dry" ? true : false;
  globby([`./dist/migrations/**/*.js`], { cwd: process.cwd() }).then(
    async (files) => {
      const db = connectDatabase();
      for (const file of files) {
        const pathArr = file.split("/");
        let currentMigration = require(`${file.replace(
          "./",
          process.cwd() + "/"
        )}`).default(db, dryRun);
        const migrationName = pathArr[pathArr.length - 1].split(".")[0];

        currentMigration =
          typeof currentMigration.then === "function"
            ? await currentMigration
            : currentMigration;
        const docRef = db.collection("migrations").doc(migrationName);
        const migrationDoc = await docRef.get();

        if (migrationDoc.exists) {
          continue;
        }

        console.log(`Running migration ${migrationName}...`);

        let result;
        try {
          result = await currentMigration.up();
        } catch (error) {
          console.log(error);
          throw new Error(`Error running ${migrationName} migration...`);
        }

        if (dryRun) {
          continue;
        }

        try {
          await docRef.set({
            result,
            createdAt: admin.firestore.Timestamp.fromDate(new Date()),
          });
        } catch (error) {
          console.log(error);
          throw new Error(`Error saving ${migrationName} migration results...`);
        }

        migrationCount = migrationCount + 1;
      }

      console.log(`${migrationCount} migrations ran successfully!`);
    }
  );
};
