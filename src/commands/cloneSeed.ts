const fbAdmin = require("firebase-admin");
const fs = require("fs");
const prettier = require("prettier");
const readline = require("readline");
const yargs = require("yargs").default(
  "dir",
  `${process.cwd()}/src/seeds`
).argv;

export default async () => {
  function connectDatabase() {
    const serviceAccountKey = JSON.parse(
      fs.readFileSync(`${process.cwd()}/service-account.json`, "utf8")
    );
    const project = serviceAccountKey.project_id;
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.cert(serviceAccountKey),
      databaseURL: `https://${project}.firebaseio.com`,
      storageBucket: `${project}.appspot.com`,
    });

    return fbAdmin.firestore();
  }

  const db = connectDatabase();
  const collectionName = yargs._[1] ? yargs._[1].toLowerCase() : null;
  const documentId = yargs.id ? yargs.id : yargs._[2] ? yargs._[2] : null;
  let seedsClonedCount = 0;
  const overwrite = yargs.o || yargs.overwrite || false;
  const seedDir = yargs.dir;

  if (!collectionName && seedDir === `${process.cwd()}/src/seeds`) {
    console.log("Collection name is required to clone a seed!");
    return false;
  }

  async function writeData(filename, data) {
    return new Promise(async (resolve, reject) => {
      const filenameParts: string[] = filename.split("/");
      filenameParts.pop();
      const folderPath = filenameParts.join("/");
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFile(filename, data, { flag: "wx" }, function (err: any) {
        if (err) {
          if (err.code === "EEXIST") {
            if (documentId && !overwrite) {
              console.error("File " + filename + " already exists!");
              const rl = readline.createInterface(
                process.stdin,
                process.stdout
              );
              rl.question("Overwrite? [yes]/no: ", function (answer) {
                if (answer === "no") {
                  console.log("Not overwritting " + filename);
                  rl.close();
                  reject({ message: "Not overwritting" });
                } else {
                  console.log("Overwriting " + filename);
                  fs.writeFile(filename, data);
                  rl.close();
                  resolve({ filename });
                }
              });
            } else {
              fs.writeFileSync(filename, data);
              resolve({ filename });
            }
          } else {
            reject(err);
          }
        } else {
          resolve({ filename });
        }
      });
    });
  }

  async function getDocument() {
    const documentRef = db.collection(collectionName).doc(documentId);
    const document = await documentRef.get();
    if (!document.exists) {
      console.log(
        `No document matching this path: ${collectionName}/${documentId}`
      );
      return false;
    }

    return document.data();
  }

  async function checkForReferences(object: any) {
    const data = object;
    for (const key of Object.keys(object)) {
      const value = object[key];
      if (value && value.constructor && value.constructor.name === "Object") {
        await checkForReferences(value);
      } else if (
        value &&
        value.constructor &&
        value.constructor.name === "DocumentReference"
      ) {
        data[
          key
        ] = `<@db.collection('${data[key]._path.segments[0]}').doc('${data[key]._path.segments[1]}')@> as any`;
      } else if (
        value &&
        value.constructor &&
        value.constructor.name === "Timestamp"
      ) {
        data[
          key
        ] = `<@admin.firestore.Timestamp.fromDate(new Date('${value.toDate()}'))@> as any`;
      } else if (
        value &&
        value.constructor &&
        value.constructor.name === "Array"
      ) {
        const cleanArray: any[] = [];
        for (const item of data[key]) {
          cleanArray.push(await checkForReferences(item));
        }
        data[key] = cleanArray;
      }
    }

    return data;
  }

  async function renderSeed(location, seedContent) {
    return new Promise(async (resolve, reject) => {
      fs.readFile(
        `${__dirname}/../../templates/seed.hbs`,
        "utf8",
        async (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          try {
            await writeData(
              location,
              prettier.format(
                data
                  .replace(
                    /{{modelName}}/g,
                    collectionName.charAt(0).toUpperCase() +
                      collectionName.substring(1, collectionName.length - 1)
                  )
                  .replace(/{{data}}/g, seedContent)
              )
            );
            seedsClonedCount++;
            resolve(data);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  async function getCollection() {
    const collectionRef = await db.collection(collectionName).get();
    if (!collectionRef.docs) {
      console.log(
        `No document matching this path: ${collectionName}/${documentId}`
      );
      return false;
    }

    return collectionRef.docs;
  }

  async function createSeedWithDocumentData(documentData: any, id?: string) {
    const cleanData = await checkForReferences(documentData);
    const seedContent = JSON.stringify(cleanData, null, 2)
      .replace(/"<@/g, "")
      .replace(/@> as any"/g, "")
      .replace(/@>"/g, "");

    return await renderSeed(
      `${seedDir}/${collectionName}/${id ? id : documentId}.ts`,
      seedContent
    );
  }

  if (documentId) {
    const documentData = await getDocument();
    await createSeedWithDocumentData(documentData);
  } else {
    const collectionData = await getCollection();
    for (const document of collectionData) {
      await createSeedWithDocumentData(document.data(), document.id);
    }
  }

  console.log(`${seedsClonedCount} seeds cloned successfully!`);
};
