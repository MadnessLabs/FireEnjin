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
var globby = require("globby");
var fbAdmin = require("firebase-admin");
var fs = require("fs");
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    function connectDatabase() {
        var _a, _b, _c;
        var serviceAccountKey = JSON.parse(fs.readFileSync(process.cwd() + "/service-account.json", "utf8"));
        var project = serviceAccountKey.project_id;
        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(serviceAccountKey),
            databaseURL: "https://" + project + ".firebaseio.com",
            storageBucket: project + ".appspot.com",
        });
        var firestore = fbAdmin.firestore();
        if ((_a = env === null || env === void 0 ? void 0 : env.firestore) === null || _a === void 0 ? void 0 : _a.emulate) {
            firestore.settings({
                host: ((_b = env.firestore) === null || _b === void 0 ? void 0 : _b.host) ? env.firestore.host : "localhost:8080",
                ssl: !!((_c = env.firestore) === null || _c === void 0 ? void 0 : _c.ssl),
            });
        }
        return firestore;
    }
    var env, getDirectories, seedCount, seedGlob, files, db, _i, files_1, file, pathArr, currentSeed, _a, isDocument, docRef, i;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                env = require(process.cwd() + "/environment.json");
                getDirectories = function (source) {
                    return fs
                        .readdirSync(source, { withFileTypes: true })
                        .filter(function (dirent) { return dirent.isDirectory(); })
                        .map(function (dirent) { return dirent.name; });
                };
                seedCount = 0;
                seedGlob = (process.argv[3]
                    ? process.argv[3]
                    : (env === null || env === void 0 ? void 0 : env.defaultSeeds) ? env.defaultSeeds
                        : getDirectories(process.cwd() + "/dist/seeds").join(","))
                    .split(",")
                    .map(function (collection) { return "./dist/seeds/" + collection + "/**/*.js"; });
                return [4 /*yield*/, globby(seedGlob)];
            case 1:
                files = _b.sent();
                db = connectDatabase();
                _i = 0, files_1 = files;
                _b.label = 2;
            case 2:
                if (!(_i < files_1.length)) return [3 /*break*/, 8];
                file = files_1[_i];
                pathArr = file.split("/");
                currentSeed = require("" + file.replace("./", process.cwd() + "/")).default(db);
                if (!(typeof currentSeed.then === "function")) return [3 /*break*/, 4];
                return [4 /*yield*/, currentSeed];
            case 3:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = currentSeed;
                _b.label = 5;
            case 5:
                currentSeed = _a;
                isDocument = pathArr[4].indexOf(".") >= 0;
                docRef = db
                    .collection(pathArr[3])
                    .doc(isDocument ? pathArr[4].split(".")[0] : pathArr[4]);
                if (!isDocument) {
                    for (i = 5; i < pathArr.length; i++) {
                        isDocument = pathArr[i].indexOf(".") >= 0;
                        docRef =
                            isDocument || docRef.doc
                                ? docRef.doc(isDocument ? pathArr[i].split(".")[0] : pathArr[i])
                                : docRef.collection(pathArr[i]);
                    }
                }
                return [4 /*yield*/, docRef.set(currentSeed)];
            case 6:
                _b.sent();
                seedCount = seedCount + 1;
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8:
                console.log(seedCount + " seeds ran successfully!");
                return [2 /*return*/];
        }
    });
}); });
