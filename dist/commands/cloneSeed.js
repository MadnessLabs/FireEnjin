"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fbAdmin = require("firebase-admin");
var fs = require("fs");
var prettier = require("prettier");
var readline = require("readline");
var yargs = require("yargs").default("dir", process.cwd() + "/src/seeds")
    .argv;
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    function connectDatabase() {
        var serviceAccountKey = JSON.parse(fs.readFileSync(process.cwd() + "/service-account.json", "utf8"));
        var project = serviceAccountKey.project_id;
        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(serviceAccountKey),
            databaseURL: "https://" + project + ".firebaseio.com",
            storageBucket: project + ".appspot.com"
        });
        return fbAdmin.firestore();
    }
    function writeData(filename, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var filenameParts, folderPath;
                        return __generator(this, function (_a) {
                            filenameParts = filename.split("/");
                            filenameParts.pop();
                            folderPath = filenameParts.join("/");
                            if (!fs.existsSync(folderPath)) {
                                fs.mkdirSync(folderPath);
                            }
                            fs.writeFile(filename, data, { flag: "wx" }, function (err) {
                                if (err) {
                                    if (err.code === "EEXIST") {
                                        if (documentId && !overwrite) {
                                            console.error("File " + filename + " already exists!");
                                            var rl_1 = readline.createInterface(process.stdin, process.stdout);
                                            rl_1.question("Overwrite? [yes]/no: ", function (answer) {
                                                if (answer === "no") {
                                                    console.log("Not overwritting " + filename);
                                                    rl_1.close();
                                                    reject({ message: "Not overwritting" });
                                                }
                                                else {
                                                    console.log("Overwriting " + filename);
                                                    fs.writeFile(filename, data);
                                                    rl_1.close();
                                                    resolve({ filename: filename });
                                                }
                                            });
                                        }
                                        else {
                                            fs.writeFileSync(filename, data);
                                            resolve({ filename: filename });
                                        }
                                    }
                                    else {
                                        reject(err);
                                    }
                                }
                                else {
                                    resolve({ filename: filename });
                                }
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    }
    function getDocument() {
        return __awaiter(this, void 0, void 0, function () {
            var documentRef, document;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        documentRef = db.collection(collectionName).doc(documentId);
                        return [4 /*yield*/, documentRef.get()];
                    case 1:
                        document = _a.sent();
                        if (!document.exists) {
                            console.log("No document matching this path: " + collectionName + "/" + documentId);
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, document.data()];
                }
            });
        });
    }
    function checkForReferences(object) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _i, _a, key, value, cleanArray, _b, _c, item, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        data = object;
                        _i = 0, _a = Object.keys(object);
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 11];
                        key = _a[_i];
                        value = object[key];
                        if (!(value && value.constructor && value.constructor.name === "Object")) return [3 /*break*/, 3];
                        return [4 /*yield*/, checkForReferences(value)];
                    case 2:
                        _f.sent();
                        return [3 /*break*/, 10];
                    case 3:
                        if (!(value &&
                            value.constructor &&
                            value.constructor.name === "DocumentReference")) return [3 /*break*/, 4];
                        data[key] = "<@db.collection('" + data[key]._path.segments[0] + "').doc('" + data[key]._path.segments[1] + "')@>";
                        return [3 /*break*/, 10];
                    case 4:
                        if (!(value &&
                            value.constructor &&
                            value.constructor.name === "Timestamp")) return [3 /*break*/, 5];
                        data[key] = "<@new Date('" + value.toDate() + "')@>";
                        return [3 /*break*/, 10];
                    case 5:
                        if (!(value &&
                            value.constructor &&
                            value.constructor.name === "Array")) return [3 /*break*/, 10];
                        cleanArray = [];
                        _b = 0, _c = data[key];
                        _f.label = 6;
                    case 6:
                        if (!(_b < _c.length)) return [3 /*break*/, 9];
                        item = _c[_b];
                        _e = (_d = cleanArray).push;
                        return [4 /*yield*/, checkForReferences(item)];
                    case 7:
                        _e.apply(_d, [_f.sent()]);
                        _f.label = 8;
                    case 8:
                        _b++;
                        return [3 /*break*/, 6];
                    case 9:
                        data[key] = cleanArray;
                        _f.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 1];
                    case 11: return [2 /*return*/, data];
                }
            });
        });
    }
    function renderSeed(location, seedContent) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            fs.readFile(__dirname + "/../../templates/seed.hbs", "utf8", function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                                var err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (err) {
                                                console.log(err);
                                                reject(err);
                                            }
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, writeData(location, prettier.format(data
                                                    .replace(/{{modelName}}/g, collectionName.charAt(0).toUpperCase() +
                                                    collectionName.substring(1, collectionName.length - 1))
                                                    .replace(/{{data}}/g, seedContent)))];
                                        case 2:
                                            _a.sent();
                                            seedsClonedCount++;
                                            resolve();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_1 = _a.sent();
                                            reject(err_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    }
    function getCollection() {
        return __awaiter(this, void 0, void 0, function () {
            var collectionRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.collection(collectionName).get()];
                    case 1:
                        collectionRef = _a.sent();
                        if (!collectionRef.docs) {
                            console.log("No document matching this path: " + collectionName + "/" + documentId);
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, collectionRef.docs];
                }
            });
        });
    }
    function createSeedWithDocumentData(documentData, id) {
        return __awaiter(this, void 0, void 0, function () {
            var cleanData, seedContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkForReferences(documentData)];
                    case 1:
                        cleanData = _a.sent();
                        seedContent = JSON.stringify(cleanData, null, 2)
                            .replace(/"<@/g, "")
                            .replace(/@>"/g, "");
                        return [4 /*yield*/, renderSeed(seedDir + "/" + collectionName + "/" + (id ? id : documentId) + ".ts", seedContent)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    var db, collectionName, documentId, seedsClonedCount, overwrite, seedDir, documentData, collectionData, _i, collectionData_1, document_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = connectDatabase();
                collectionName = yargs._[1] ? yargs._[1].toLowerCase() : null;
                documentId = yargs.id ? yargs.id : yargs._[2] ? yargs._[2] : null;
                seedsClonedCount = 0;
                overwrite = yargs.o || yargs.overwrite || false;
                seedDir = yargs.dir;
                if (!collectionName && seedDir === process.cwd() + "/src/seeds") {
                    console.log("Collection name is required to clone a seed!");
                    return [2 /*return*/, false];
                }
                if (!documentId) return [3 /*break*/, 3];
                return [4 /*yield*/, getDocument()];
            case 1:
                documentData = _a.sent();
                return [4 /*yield*/, createSeedWithDocumentData(documentData)];
            case 2:
                _a.sent();
                return [3 /*break*/, 8];
            case 3: return [4 /*yield*/, getCollection()];
            case 4:
                collectionData = _a.sent();
                _i = 0, collectionData_1 = collectionData;
                _a.label = 5;
            case 5:
                if (!(_i < collectionData_1.length)) return [3 /*break*/, 8];
                document_1 = collectionData_1[_i];
                return [4 /*yield*/, createSeedWithDocumentData(document_1.data(), document_1.id)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                console.log(seedsClonedCount + " seeds cloned successfully!");
                return [2 /*return*/];
        }
    });
}); });
