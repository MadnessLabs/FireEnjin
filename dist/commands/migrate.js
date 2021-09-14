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
var admin = require("firebase-admin");
var fs = require("fs");
function connectDatabase() {
    var serviceAccountKey = JSON.parse(fs.readFileSync(process.cwd() + "/service-account.json", "utf8"));
    var project = serviceAccountKey.project_id;
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        databaseURL: "https://" + project + ".firebaseio.com",
        storageBucket: project + ".appspot.com",
    });
    return admin.firestore();
}
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var migrationCount, dryRun;
    return __generator(this, function (_a) {
        migrationCount = 0;
        dryRun = process.argv[3] && process.argv[3] === "dry" ? true : false;
        globby(["./dist/migrations/**/*.js"], { cwd: process.cwd() }).then(function (files) { return __awaiter(void 0, void 0, void 0, function () {
            var db, _i, files_1, file, pathArr, currentMigration, migrationName, _a, docRef, migrationDoc, result, error_1, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        db = connectDatabase();
                        _i = 0, files_1 = files;
                        _b.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 15];
                        file = files_1[_i];
                        pathArr = file.split("/");
                        currentMigration = require("" + file.replace("./", process.cwd() + "/")).default(db, dryRun);
                        migrationName = pathArr[pathArr.length - 1].split(".")[0];
                        if (!(typeof currentMigration.then === "function")) return [3 /*break*/, 3];
                        return [4 /*yield*/, currentMigration];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = currentMigration;
                        _b.label = 4;
                    case 4:
                        currentMigration = _a;
                        docRef = db.collection("migrations").doc(migrationName);
                        return [4 /*yield*/, docRef.get()];
                    case 5:
                        migrationDoc = _b.sent();
                        if (migrationDoc.exists) {
                            return [3 /*break*/, 14];
                        }
                        console.log("Running migration " + migrationName + "...");
                        result = void 0;
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, currentMigration.up()];
                    case 7:
                        result = _b.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        console.log(error_1);
                        throw new Error("Error running " + migrationName + " migration...");
                    case 9:
                        if (dryRun) {
                            return [3 /*break*/, 14];
                        }
                        _b.label = 10;
                    case 10:
                        _b.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, docRef.set({
                                result: result,
                                createdAt: admin.firestore.Timestamp.fromDate(new Date()),
                            })];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        error_2 = _b.sent();
                        console.log(error_2);
                        throw new Error("Error saving " + migrationName + " migration results...");
                    case 13:
                        migrationCount = migrationCount + 1;
                        _b.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 1];
                    case 15:
                        console.log(migrationCount + " migrations ran successfully!");
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
