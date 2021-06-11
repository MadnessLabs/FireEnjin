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
var globby = require("globby");
var pluralize = require("pluralize");
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
                                    resolve(data);
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
function capitalize(s) {
    if (typeof s !== "string")
        return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function camelize(s) {
    if (typeof s !== "string")
        return "";
    return s.charAt(0).toLowerCase() + s.slice(1);
}
function replaceModelName(data, modelName) {
    return data
        .replace(/{{pascalCase modelName}}/g, capitalize(modelName))
        .replace(/{{camelCase modelName}}/g, modelName);
}
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var importStr, exportStr, endpointStr, skipResolvers, triggers, endpoints, models, endpointCount, schema, _i, _a, file, pathParts, triggerName, _b, _c, gqlType, _d, _e, field, modelName, modelName, modelName, modelName, modelName, _f, _g, modelName, e_1;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                importStr = "";
                exportStr = "";
                endpointStr = "";
                skipResolvers = [];
                triggers = [];
                endpoints = [];
                models = {};
                endpointCount = 0;
                schema = require(process.cwd() + "/dist/graphql.schema.json");
                // CHECK FOR CUSTOM RESOLVERS
                try {
                    fs.readdir(process.cwd() + "/dist/resolvers/", function (err, files) {
                        files.forEach(function (file) {
                            skipResolvers.push(file.split(".")[0].toLowerCase());
                        });
                    });
                }
                catch (err) {
                    console.log("error getting resolver...");
                }
                _i = 0;
                return [4 /*yield*/, globby("./src/triggers/**/*.ts")];
            case 1:
                _a = _h.sent();
                _h.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                file = _a[_i];
                pathParts = file.split("/");
                triggerName = pathParts[pathParts.length - 1].split(".")[0];
                importStr += "const " + triggerName + " = require(\"./triggers/" + triggerName + "\");\n";
                exportStr += "  " + triggerName + ": " + triggerName + ".default,\n";
                triggers.push(triggerName.toLowerCase());
                _h.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 2];
            case 4:
                // CREATE API ENDPOINTS FROM GRAPHQL SCHEMA
                for (_b = 0, _c = schema.__schema.types; _b < _c.length; _b++) {
                    gqlType = _c[_b];
                    if (["Query", "Mutation"].indexOf(gqlType.name) === -1)
                        continue;
                    for (_d = 0, _e = gqlType.fields; _d < _e.length; _d++) {
                        field = _e[_d];
                        if (endpoints.indexOf(field.name.toLowerCase) >= 0 ||
                            skipResolvers.indexOf(field.name.toLowerCase()) >= 0 ||
                            triggers.indexOf(field.name.toLowerCase()) >= 0)
                            continue;
                        if (gqlType.name === "Query" && field.type.kind === "OBJECT") {
                            try {
                                modelName = capitalize(pluralize.singular(field.name));
                                models[modelName] = true;
                                endpointStr += "app.get(\"/" + camelize(modelName) + "/:id\", async (req, res) => {\n  const model = new " + modelName + "." + modelName + "Model();\n  if (\n    model.onAuth &&\n    typeof model.onAuth === \"function\" &&\n    !(await model.onAuth(\n      \"find\",\n      {\n        id: req.params.id,\n      },\n      hookOptions\n    ))\n  )\n    return res.status(400).send({\n      message: \"Permission Denied!\"\n    });\n  const doc =\n    model.onBeforeFind && typeof model.onBeforeFind === \"function\"\n      ? await model.onBeforeFind(req.params.id, hookOptions)\n      : await model.find(req.params.id);\n  return res.send(\n    await cleanData(\n      model.onAfterFind && typeof model.onAfterFind === \"function\"\n        ? await model.onAfterFind(doc, hookOptions)\n        : doc\n    , {with: req.query.with, include: req.query.include, exclude: req.query.exclude})\n  );\n});\n";
                            }
                            catch (e) {
                                endpointCount--;
                                console.log("Error creating " + field.name + " trigger...", e);
                            }
                        }
                        else if (gqlType.name === "Query" && field.type.kind === "LIST") {
                            try {
                                modelName = capitalize(pluralize.singular(field.name));
                                models[modelName] = true;
                                endpointStr += "app.get(\"/" + camelize(modelName) + "\",  async (req, res) => {\n  const model = new " + modelName + "." + modelName + "Model();\n  if (\n    model.onAuth &&\n    typeof model.onAuth === \"function\" &&\n    !(await model.onAuth(\"list\", req.query ? req.query : {}, hookOptions))\n  )\n    return res.status(400).send({\n      message: \"Permission Denied!\"\n    });\n  const docs =\n    model.onBeforeList && typeof model.onBeforeList === \"function\"\n      ? await model.onBeforeList(req.query, hookOptions)\n      : await model.paginate(req.query);\n  return res.send(\n    await cleanData(\n      model.onAfterList && typeof model.onAfterList === \"function\"\n        ? await model.onAfterList(docs, hookOptions)\n        : docs\n    , {with: req.query.with, include: req.query.include, exclude: req.query.exclude})\n  );\n});\n";
                            }
                            catch (e) {
                                endpointCount--;
                                console.log("Error creating " + field.name + " trigger...", e);
                            }
                        }
                        else if (gqlType.name === "Mutation" && field.name.startsWith("add")) {
                            try {
                                modelName = capitalize(field.name.slice(3));
                                models[modelName] = true;
                                endpointStr += "app.post(\"/" + camelize(modelName) + "\", async (req, res) => {\n  const requestInput = typeof req.body === \"string\" ? JSON.parse(requestInput) : requestInput;\n  if (typeof requestInput === \"string\") return res.status(400).send({\n    message: \"Invalid doc data input!\"\n  });\n  const model = new " + modelName + "." + modelName + "Model();\n  if (\n    model.onAuth &&\n    typeof model.onAuth === \"function\" &&\n    !(await model.onAuth(\"add\", requestInput, hookOptions))\n  )\n    return res.status(400).send({\n      message: \"Permission Denied!\"\n    });\n  const docData =\n    model.onBeforeAdd && typeof model.onBeforeAdd === \"function\"\n      ? await model.onBeforeAdd(requestInput, hookOptions)\n      : model.onBeforeWrite && typeof model.onBeforeWrite === \"function\"\n      ? await model.onBeforeWrite(requestInput, hookOptions)\n      : requestInput;\n  if (docData === false) {\n    return res.status(400).send({\n      message: \"No data for doc!\"\n    });\n  }\n\n  const newDoc = await model.create(docData);\n\n  return res.send(\n    await cleanData(\n      model.onAfterAdd && typeof model.onAfterAdd === \"function\"\n        ? await model.onAfterAdd(newDoc, hookOptions)\n        : model.onAfterWrite && typeof model.onAfterWrite === \"function\"\n        ? await model.onAfterWrite(newDoc, hookOptions)\n        : newDoc\n    , {with: requestInput.with, include: requestInput.include, exclude: requestInput.exclude})\n  );\n});\n";
                            }
                            catch (e) {
                                endpointCount--;
                                console.log("Error creating " + field.name + " trigger...", e);
                            }
                        }
                        else if (gqlType.name === "Mutation" && field.name.startsWith("edit")) {
                            try {
                                modelName = capitalize(field.name.slice(4));
                                models[modelName] = true;
                                endpointStr += "app.post(\"/" + camelize(modelName) + "/:id\", async (req, res) => {\n  const requestInput = typeof req.body === \"string\" ? JSON.parse(requestInput) : requestInput;\n  if (typeof requestInput === \"string\") return res.status(400).send({\n    message: \"Invalid doc data input!\"\n  });\n  const model = new " + modelName + "." + modelName + "Model();\n  if (\n    model.onAuth &&\n    typeof model.onAuth === \"function\" &&\n    !(await model.onAuth(\"edit\", { ...requestInput, id: req.params.id }, hookOptions))\n  )\n    return res.status(400).send({\n      message: \"Permission Denied!\"\n    });\n  const docData =\n    model.onBeforeEdit && typeof model.onBeforeEdit === \"function\"\n      ? await model.onBeforeEdit({ id: req.params.id, ...requestInput }, hookOptions)\n      : model.onBeforeWrite && typeof model.onBeforeWrite === \"function\"\n      ? await model.onBeforeWrite({ id: req.params.id, ...requestInput }, hookOptions)\n      : data;\n  if (docData === false) {\n    return res.status(400).send({\n      message: \"No data for doc!\"\n    });\n  }\n\n  const doc = await model.update({ id: req.params.id, ...requestInput });\n  \n  return res.send(\n    await cleanData(\n      model.onAfterEdit && typeof model.onAfterEdit === \"function\"\n        ? await model.onAfterEdit(doc, hookOptions)\n        : model.onAfterWrite && typeof model.onAfterWrite === \"function\"\n        ? await model.onAfterWrite(doc, hookOptions)\n        : doc\n    , {with: requestInput.with, include: requestInput.include, exclude: requestInput.exclude})\n  );\n});\n";
                            }
                            catch (e) {
                                endpointCount--;
                                console.log("Error creating " + field.name + " trigger...", e);
                            }
                        }
                        else if (gqlType.name === "Mutation" &&
                            field.name.startsWith("delete")) {
                            try {
                                modelName = capitalize(field.name.slice(6));
                                models[modelName] = true;
                                endpointStr += "app.delete(\"/" + camelize(modelName) + "/:id\", async (req, res) => {\n  const requestInput = typeof req.body === \"string\" ? JSON.parse(requestInput) : requestInput;\n  if (typeof requestInput === \"string\") return res.status(400).send({\n    message: \"Invalid doc data input!\"\n  });\n  const model = new " + modelName + "." + modelName + "Model();\n  if (\n    model.onAuth &&\n    typeof model.onAuth === \"function\" &&\n    !(await model.onAuth(\"list\", { id: req.params.id }, hookOptions))\n  )\n    return res.status(400).send({\n      message: \"Permission Denied!\"\n    });\n  const modelBefore = await model.find(req.params.id);\n  if (model.onBeforeDelete && typeof model.onBeforeDelete === \"function\") {\n    const res = await model.onBeforeDelete({\n      id: req.params.id,\n      ...modelBefore\n    }, hookOptions);\n    if (res === false) {\n      return res.status(400).send({\n        message: \"No data for doc!\"\n      });\n    }\n  }\n  await model.delete(req.params.id);\n\n  return res.send(\n    await cleanData(\n      model.onAfterDelete && typeof model.onAfterDelete === \"function\"\n        ? await model.onAfterDelete({ id: req.params.id, ...modelBefore }, hookOptions)\n        : { id: req.params.id, ...modelBefore }\n    , {with: req.query.with, include: req.query.include, exclude: req.query.exclude})\n  );\n});\n";
                            }
                            catch (e) {
                                endpointCount--;
                                console.log("Error creating " + field.name + " trigger...", e);
                            }
                        }
                        endpoints.push(field.name.toLowerCase());
                    }
                }
                for (_f = 0, _g = Object.keys(models); _f < _g.length; _f++) {
                    modelName = _g[_f];
                    importStr += "const " + modelName + " = require(\"./models/" + modelName + "\");\n";
                }
                _h.label = 5;
            case 5:
                _h.trys.push([5, 7, , 8]);
                return [4 /*yield*/, renderToFile("firebaseFunctionsIndex", "./dist/index.js", function (data) {
                        return data
                            .replace(/{{imports}}/g, importStr)
                            .replace(/{{exports}}/g, exportStr)
                            .replace(/{{endpoints}}/g, endpointStr);
                    })];
            case 6:
                _h.sent();
                return [3 /*break*/, 8];
            case 7:
                e_1 = _h.sent();
                console.log("Error rendering firebase functions index... ", e_1);
                return [3 /*break*/, 8];
            case 8:
                console.log("Rendered Firebase Functions index file with " + (triggers.length +
                    1) + " triggers and " + (endpointCount + endpoints.length) + " api endpoints...");
                return [2 /*return*/];
        }
    });
}); });
