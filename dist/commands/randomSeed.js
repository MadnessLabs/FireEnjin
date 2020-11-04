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
var fs = require("fs");
var prettier = require("prettier");
var readline = require("readline");
var yargs = require("yargs").default("dir", process.cwd() + "/src/seeds")
    .argv;
var pluralize = require("pluralize");
var faker = require('faker');
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    function renderToFile(templateName, location, dataFilter) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            fs.readFile(__dirname + "/../../templates/" + templateName + ".hbs", "utf8", function (_err, data) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    try {
                                        fs.writeFileSync(location, dataFilter(data));
                                        resolve();
                                    }
                                    catch (err) {
                                        reject(err);
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    }
    var collectionName, seedCount, seedsClonedCount, overwrite, seedDir, schema, _i, _a, gqlType, _b, _c, field;
    return __generator(this, function (_d) {
        collectionName = yargs._[1] ? yargs._[1].toLowerCase() : null;
        seedCount = yargs.count ? yargs.count : yargs._[2] ? yargs._[2] : null;
        seedsClonedCount = 0;
        overwrite = yargs.o || yargs.overwrite || false;
        seedDir = yargs.dir;
        if (!collectionName && seedDir === process.cwd() + "/src/seeds") {
            console.log("Collection name is required to add a seed!");
            return [2 /*return*/, false];
        }
        schema = require(process.cwd() + "/dist/graphql.schema.json");
        for (_i = 0, _a = schema.__schema.types; _i < _a.length; _i++) {
            gqlType = _a[_i];
            if (gqlType.kind !== "OBJECT" || gqlType.name.toLowerCase() !== pluralize.singular(collectionName).toLowerCase())
                continue;
            for (_b = 0, _c = gqlType.fields; _b < _c.length; _b++) {
                field = _c[_b];
                if (field.type.kind !== "SCALAR")
                    continue;
                console.log(field.name, field.type.name, faker.fake('{{name.firstName}}'));
            }
        }
        console.log(seedsClonedCount + " seeds cloned successfully!");
        return [2 /*return*/];
    });
}); });
