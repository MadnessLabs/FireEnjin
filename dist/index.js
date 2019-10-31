#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var triggers_1 = __importDefault(require("./commands/triggers"));
var cloneSeed_1 = __importDefault(require("./commands/cloneSeed"));
var env_1 = __importDefault(require("./commands/env"));
var generate_1 = __importDefault(require("./commands/generate"));
var migrate_1 = __importDefault(require("./commands/migrate"));
var runSeed_1 = __importDefault(require("./commands/runSeed"));
if (process.argv.length > 2) {
    if (process.argv[2] === "triggers") {
        triggers_1.default().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "generate") {
        generate_1.default().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "seed:clone") {
        cloneSeed_1.default().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "seed") {
        runSeed_1.default().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "env") {
        env_1.default().catch(function (err) { return console.log(err); });
    }
    else if (process.argv[2] === "migrate") {
        migrate_1.default().catch(function (err) { return console.log(err); });
    }
    else {
        console.log(process.argv[2] + " command doesn't exist!");
    }
}
else {
    var docs = fs.readFileSync(__dirname + "/../README.md", "utf8");
    console.log(docs);
}
