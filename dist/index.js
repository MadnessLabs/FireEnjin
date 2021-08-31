#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var triggers_1 = __importDefault(require("./commands/triggers"));
var cloneSeed_1 = __importDefault(require("./commands/cloneSeed"));
var copy_1 = __importDefault(require("./commands/copy"));
var env_1 = __importDefault(require("./commands/env"));
var generate_1 = __importDefault(require("./commands/generate"));
var migrate_1 = __importDefault(require("./commands/migrate"));
var new_1 = __importDefault(require("./commands/new"));
var presets_1 = __importDefault(require("./commands/presets"));
var runSeed_1 = __importDefault(require("./commands/runSeed"));
var randomSeed_1 = __importDefault(require("./commands/randomSeed"));
if (process.argv.length > 2) {
    if (process.argv[2] === "copy") {
        (0, copy_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "generate") {
        (0, generate_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "seed:random") {
        (0, randomSeed_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "seed:clone") {
        (0, cloneSeed_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "seed") {
        (0, runSeed_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "presets") {
        (0, presets_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "env") {
        (0, env_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "migrate") {
        (0, migrate_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "triggers") {
        (0, triggers_1.default)().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "new") {
        (0, new_1.default)().catch(function (err) { return console.log(err); });
    }
    else {
        console.log(process.argv[2] + " command doesn't exist!");
    }
}
else {
    var docs = fs.readFileSync(__dirname + "/../README.md", "utf8");
    console.log(docs);
}
