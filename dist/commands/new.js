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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodegit_1 = __importDefault(require("nodegit"));
var inquirer_1 = __importDefault(require("inquirer"));
var path_1 = __importDefault(require("path"));
var rimraf_1 = __importDefault(require("rimraf"));
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var defaultNamespace, results, pathParts, answers, _a, _b, _c, _d, _e, _f;
    var _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                defaultNamespace = true;
                results = {
                    repos: []
                };
                pathParts = process.cwd().split(path_1.default.sep);
                return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            type: 'input',
                            name: 'namespace',
                            message: "What's your app's namespace?",
                            default: function () {
                                return (process === null || process === void 0 ? void 0 : process.argv[3]) ? process.argv[3] : pathParts[pathParts.length - 1];
                            },
                            validate: function (answer) {
                                if (answer !== path_1.default.dirname(process.cwd()).split(path_1.default.sep).pop()) {
                                    defaultNamespace = false;
                                }
                                return true;
                            }
                        },
                        {
                            type: 'checkbox',
                            message: 'Select Project Needs',
                            name: 'repos',
                            choices: [
                                {
                                    name: 'App',
                                    checked: true
                                },
                                {
                                    name: 'Backend',
                                    checked: true
                                },
                                {
                                    name: 'Components',
                                    checked: true
                                },
                            ],
                            validate: function (answer) {
                                if (answer.length < 1) {
                                    return 'You must choose at least one for your project.';
                                }
                                return true;
                            },
                        },
                    ])];
            case 1:
                answers = _k.sent();
                if (!answers) return [3 /*break*/, 10];
                if (!((_g = answers === null || answers === void 0 ? void 0 : answers.repos) === null || _g === void 0 ? void 0 : _g.includes("App"))) return [3 /*break*/, 4];
                _b = (_a = results.repos).push;
                return [4 /*yield*/, nodegit_1.default.Clone("https://github.com/madnesslabs/fireenjin-app.git", (!defaultNamespace ? answers.namespace + "/" : "") + "app")];
            case 2:
                _b.apply(_a, [_k.sent()]);
                return [4 /*yield*/, rimraf_1.default.sync((!defaultNamespace ? answers.namespace + "/" : "") + "app/.git")];
            case 3:
                _k.sent();
                _k.label = 4;
            case 4:
                if (!((_h = answers === null || answers === void 0 ? void 0 : answers.repos) === null || _h === void 0 ? void 0 : _h.includes("Backend"))) return [3 /*break*/, 7];
                _d = (_c = results.repos).push;
                return [4 /*yield*/, nodegit_1.default.Clone("https://github.com/madnesslabs/fireenjin-backend.git", (!defaultNamespace ? answers.namespace + "/" : "") + "backend")];
            case 5:
                _d.apply(_c, [_k.sent()]);
                return [4 /*yield*/, rimraf_1.default.sync((!defaultNamespace ? answers.namespace + "/" : "") + "backend/.git")];
            case 6:
                _k.sent();
                _k.label = 7;
            case 7:
                if (!((_j = answers === null || answers === void 0 ? void 0 : answers.repos) === null || _j === void 0 ? void 0 : _j.includes("Components"))) return [3 /*break*/, 10];
                _f = (_e = results.repos).push;
                return [4 /*yield*/, nodegit_1.default.Clone("https://github.com/madnesslabs/fireenjin-components.git", (!defaultNamespace ? answers.namespace + "/" : "") + "components")];
            case 8:
                _f.apply(_e, [_k.sent()]);
                return [4 /*yield*/, rimraf_1.default.sync((!defaultNamespace ? answers.namespace + "/" : "") + "components/.git")];
            case 9:
                _k.sent();
                _k.label = 10;
            case 10: return [2 /*return*/, results];
        }
    });
}); });
