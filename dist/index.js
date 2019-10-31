'use strict';

var fs$4 = require('fs');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const fs = require("fs");
const globby = require("globby");
function renderIndex(location, importStr, exportStr) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            fs.readFile("./templates/firebaseFunctionsIndex.hbs", "utf8", (_err, data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield writeData(location, data
                        .replace(/{{imports}}/g, importStr)
                        .replace(/{{exports}}/g, exportStr));
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            }));
        }));
    });
}
function writeData(filename, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            fs.readFile(filename, (err) => {
                if (err) {
                    console.log("Error ensuring file exists!");
                    reject();
                }
                fs.writeFileSync(filename, data);
                resolve({ filename });
            });
        }));
    });
}
var triggersCommand = () => __awaiter(void 0, void 0, void 0, function* () {
    let importStr = ``;
    let exportStr = ``;
    const files = yield globby(`./src/triggers/**/*.ts`);
    for (const file of files) {
        const pathParts = file.split("/");
        const triggerName = pathParts[pathParts.length - 1].split(".")[0];
        importStr += `const ${triggerName}_1 = require("./triggers/${triggerName}");`;
        exportStr += `${triggerName}: ${triggerName}_1.default,`;
    }
    try {
        yield renderIndex("./dist/index.js", importStr, exportStr);
    }
    catch (error) {
        console.log(error);
    }
    console.log(`Rendered Firebase Functions index file with ${files.length} triggers...`);
});

const fbAdmin = require("firebase-admin");
const fs$1 = require("fs");
const prettier = require("prettier");
const readline = require("readline");
const yargs = require("yargs").default("dir", `${process.cwd()}/src/seeds`)
    .argv;
var cloneSeedCommand = () => __awaiter(void 0, void 0, void 0, function* () {
    function connectDatabase() {
        const serviceAccountKey = JSON.parse(fs$1.readFileSync(`${process.cwd()}/service-account.json`, "utf8"));
        const project = serviceAccountKey.project_id;
        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(serviceAccountKey),
            databaseURL: `https://${project}.firebaseio.com`,
            storageBucket: `${project}.appspot.com`
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
    function writeData(filename, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const filenameParts = filename.split("/");
                filenameParts.pop();
                const folderPath = filenameParts.join("/");
                if (!fs$1.existsSync(folderPath)) {
                    fs$1.mkdirSync(folderPath);
                }
                fs$1.writeFile(filename, data, { flag: "wx" }, function (err) {
                    if (err) {
                        if (err.code === "EEXIST") {
                            if (documentId && !overwrite) {
                                console.error("File " + filename + " already exists!");
                                const rl = readline.createInterface(process.stdin, process.stdout);
                                rl.question("Overwrite? [yes]/no: ", function (answer) {
                                    if (answer === "no") {
                                        console.log("Not overwritting " + filename);
                                        rl.close();
                                        reject({ message: "Not overwritting" });
                                    }
                                    else {
                                        console.log("Overwriting " + filename);
                                        fs$1.writeFile(filename, data);
                                        rl.close();
                                        resolve({ filename });
                                    }
                                });
                            }
                            else {
                                fs$1.writeFileSync(filename, data);
                                resolve({ filename });
                            }
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        resolve({ filename });
                    }
                });
            }));
        });
    }
    function getDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            const documentRef = db.collection(collectionName).doc(documentId);
            const document = yield documentRef.get();
            if (!document.exists) {
                console.log(`No document matching this path: ${collectionName}/${documentId}`);
                return false;
            }
            return document.data();
        });
    }
    function checkForReferences(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = object;
            for (const key of Object.keys(object)) {
                const value = object[key];
                if (value && value.constructor && value.constructor.name === "Object") {
                    yield checkForReferences(value);
                }
                else if (value &&
                    value.constructor &&
                    value.constructor.name === "DocumentReference") {
                    data[key] = `<@db.collection('${data[key]._path.segments[0]}').doc('${data[key]._path.segments[1]}')@>`;
                }
                else if (value &&
                    value.constructor &&
                    value.constructor.name === "Timestamp") {
                    data[key] = `<@new Date('${value.toDate()}')@>`;
                }
                else if (value &&
                    value.constructor &&
                    value.constructor.name === "Array") {
                    const cleanArray = [];
                    for (const item of data[key]) {
                        cleanArray.push(yield checkForReferences(item));
                    }
                    data[key] = cleanArray;
                }
            }
            return data;
        });
    }
    function renderSeed(location, seedContent) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                fs$1.readFile("./templates/seed.hbs", "utf8", (err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    try {
                        yield writeData(location, prettier.format(data
                            .replace(/{{modelName}}/g, collectionName.charAt(0).toUpperCase() +
                            collectionName.substring(1, collectionName.length - 1))
                            .replace(/{{data}}/g, seedContent)));
                        seedsClonedCount++;
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }));
            }));
        });
    }
    function getCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionRef = yield db.collection(collectionName).get();
            if (!collectionRef.docs) {
                console.log(`No document matching this path: ${collectionName}/${documentId}`);
                return false;
            }
            return collectionRef.docs;
        });
    }
    function createSeedWithDocumentData(documentData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanData = yield checkForReferences(documentData);
            const seedContent = JSON.stringify(cleanData, null, 2)
                .replace(/"<@/g, "")
                .replace(/@>"/g, "");
            return yield renderSeed(`${seedDir}/${collectionName}/${id ? id : documentId}.ts`, seedContent);
        });
    }
    if (documentId) {
        const documentData = yield getDocument();
        yield createSeedWithDocumentData(documentData);
    }
    else {
        const collectionData = yield getCollection();
        for (const document of collectionData) {
            yield createSeedWithDocumentData(document.data(), document.id);
        }
    }
    console.log(`${seedsClonedCount} seeds cloned successfully!`);
});

const globby$1 = require("globby");
const currentEnv = process.argv[3] ? process.argv[3] : "local";
var envCommand = () => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield globby$1(`./env/${currentEnv}/**/*.*`);
    console.log(`Running ${currentEnv} environment setup by copying ${files.length} files...`);
    for (const file of files) {
        fs$4.copyFileSync(file, process.cwd() +
            "/" +
            file
                .split("/")
                .filter((_part, index) => index > 2)
                .join("/"));
    }
});

const util = require("util");
const exec = util.promisify(require("child_process").exec);
var generateCommand = () => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout, stderr } = yield exec(`exec < /dev/tty; npm run g:${process.argv[3]}`);
    console.log(stdout, stderr);
});

const globby$2 = require("globby");
const admin = require("firebase-admin");
const fs$2 = require("fs");
function connectDatabase() {
    const serviceAccountKey = JSON.parse(fs$2.readFileSync(`${process.cwd()}/service-account.json`, "utf8"));
    const project = serviceAccountKey.project_id;
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        databaseURL: `https://${project}.firebaseio.com`,
        storageBucket: `${project}.appspot.com`
    });
    return admin.firestore();
}
var migrateCommand = () => __awaiter(void 0, void 0, void 0, function* () {
    let migrationCount = 0;
    const dryRun = process.argv[3] && process.argv[3] === "dry" ? true : false;
    globby$2([`${process.cwd()}/dist/migrations/**/*.js`]).then((files) => __awaiter(void 0, void 0, void 0, function* () {
        const db = connectDatabase();
        for (const file of files) {
            const pathArr = file.split("/");
            let currentMigration = require(`../${file}`).default(db, dryRun);
            const migrationName = pathArr[pathArr.length - 1].split(".")[0];
            currentMigration =
                typeof currentMigration.then === "function"
                    ? yield currentMigration
                    : currentMigration;
            const docRef = db.collection("migrations").doc(migrationName);
            const migrationDoc = yield docRef.get();
            if (migrationDoc.exists) {
                continue;
            }
            console.log(`Running migration ${migrationName}...`);
            let result;
            try {
                result = yield currentMigration.up();
            }
            catch (error) {
                console.log(`Error running ${migrationName} migration...`);
                throw new Error(error);
            }
            if (dryRun) {
                continue;
            }
            try {
                yield docRef.set({
                    result,
                    createdAt: admin.firestore.Timestamp.fromDate(new Date())
                });
            }
            catch (error) {
                console.log(`Error saving ${migrationName} migration results...`);
                throw new Error(error);
            }
            migrationCount = migrationCount + 1;
        }
        console.log(`${migrationCount} migrations ran successfully!`);
    }));
});

const globby$3 = require("globby");
const fbAdmin$1 = require("firebase-admin");
const fs$3 = require("fs");
var runSeedCommand = () => __awaiter(void 0, void 0, void 0, function* () {
    function connectDatabase() {
        const serviceAccountKey = JSON.parse(fs$3.readFileSync(`${process.cwd()}/service-account.json`, "utf8"));
        const project = serviceAccountKey.project_id;
        fbAdmin$1.initializeApp({
            credential: fbAdmin$1.credential.cert(serviceAccountKey),
            databaseURL: `https://${project}.firebaseio.com`,
            storageBucket: `${project}.appspot.com`
        });
        return fbAdmin$1.firestore();
    }
    let seedCount = 0;
    const seedGlob = (process.argv[3] ? process.argv[3] : "users")
        .split(",")
        .map(collection => `./dist/seeds/${collection}/**/*.js`);
    const files = yield globby$3(seedGlob);
    const db = connectDatabase();
    for (const file of files) {
        const pathArr = file.split("/");
        let currentSeed = require(`${file.replace("./", `${process.cwd()}/`)}`).default(db);
        currentSeed =
            typeof currentSeed.then === "function" ? yield currentSeed : currentSeed;
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
        yield docRef.set(currentSeed);
        seedCount = seedCount + 1;
    }
    console.log(`${seedCount} seeds ran successfully!`);
});

const enjinDir = __dirname;
if (process.argv.length > 2) {
    if (process.argv[2] === "triggers") {
        triggersCommand().catch(err => console.log(err));
    }
    else if (process.argv[2] === "generate") {
        generateCommand().catch(err => console.log(err));
    }
    else if (process.argv[2] === "seed:clone") {
        cloneSeedCommand().catch(err => console.log(err));
    }
    else if (process.argv[2] === "seed") {
        runSeedCommand().catch(err => console.log(err));
    }
    else if (process.argv[2] === "env") {
        envCommand().catch(err => console.log(err));
    }
    else if (process.argv[2] === "migrate") {
        migrateCommand().catch(err => console.log(err));
    }
    else {
        console.log(`${process.argv[2]} command doesn't exist!`);
    }
}
else {
    const docs = fs$4.readFileSync(enjinDir + "/README.md", "utf8");
    console.log(docs);
}
