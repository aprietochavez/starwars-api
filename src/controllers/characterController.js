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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.getCharacters = exports.createCharacter = void 0;
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var axios_1 = __importDefault(require("axios"));
var translationService_1 = require("../services/translationService");
var dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
var TABLE_NAME = process.env.TABLE_NAME;
// Función para obtener datos de la API SWAPI
var fetchSWAPIData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get('https://swapi.py4e.com/api/people/')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.results.slice(0, 2)]; // Limitar a 2 personajes
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching SWAPI data:", error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
var translateKey = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    var translatedKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, translationService_1.translate)(key)];
            case 1:
                translatedKey = _a.sent();
                return [2 /*return*/, translatedKey ? translatedKey.toLowerCase() : 'undefined_key'];
        }
    });
}); };
// Función para crear un personaje
var createCharacter = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var swapiData, translatedCharacters, _i, swapiData_1, character, translatedCharacter, keysToTranslate, _a, keysToTranslate_1, key, translatedKey, translatedValue, params;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetchSWAPIData()];
            case 1:
                swapiData = _b.sent();
                translatedCharacters = [];
                _i = 0, swapiData_1 = swapiData;
                _b.label = 2;
            case 2:
                if (!(_i < swapiData_1.length)) return [3 /*break*/, 12];
                character = swapiData_1[_i];
                translatedCharacter = {};
                keysToTranslate = ['name', 'gender'];
                _a = 0, keysToTranslate_1 = keysToTranslate;
                _b.label = 3;
            case 3:
                if (!(_a < keysToTranslate_1.length)) return [3 /*break*/, 8];
                key = keysToTranslate_1[_a];
                if (!character[key]) return [3 /*break*/, 6];
                return [4 /*yield*/, translateKey(key)];
            case 4:
                translatedKey = _b.sent();
                return [4 /*yield*/, (0, translationService_1.translate)(character[key])];
            case 5:
                translatedValue = _b.sent();
                translatedCharacter[translatedKey] = translatedValue;
                console.log("Translated ".concat(key, " to ").concat(translatedKey, ": ").concat(translatedValue));
                return [3 /*break*/, 7];
            case 6:
                console.warn("El personaje no tiene la clave ".concat(key, ":"), character);
                _b.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 3];
            case 8:
                console.log("Translated Character Object:", translatedCharacter);
                if (!translatedCharacter.nombre || !translatedCharacter.sexo) {
                    console.error("El personaje está faltando las claves requeridas:", translatedCharacter);
                    return [2 /*return*/, {
                            statusCode: 500,
                            body: JSON.stringify({ message: "El personaje está faltando las claves requeridas" }),
                        }];
                }
                if (!(translatedCharacter.nombre && translatedCharacter.sexo)) return [3 /*break*/, 10];
                params = {
                    TableName: TABLE_NAME,
                    Item: translatedCharacter,
                };
                return [4 /*yield*/, dynamoDB.put(params).promise()];
            case 9:
                _b.sent();
                translatedCharacters.push(translatedCharacter);
                console.log("Personaje insertado en DynamoDB:", translatedCharacter);
                return [3 /*break*/, 11];
            case 10:
                console.error("El personaje está faltando las claves requeridas:", translatedCharacter);
                _b.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 2];
            case 12: return [2 /*return*/, {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Characters added successfully!' }),
                }];
        }
    });
}); };
exports.createCharacter = createCharacter;
// Función para obtener todos los personajes de DynamoDB
var getCharacters = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var params, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                params = {
                    TableName: TABLE_NAME,
                };
                return [4 /*yield*/, dynamoDB.scan(params).promise()];
            case 1:
                data = _a.sent();
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify(data.Items),
                    }];
            case 2:
                error_2 = _a.sent();
                console.error("Error getting characters:", error_2);
                throw new Error('Error fetching characters from DynamoDB');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCharacters = getCharacters;
