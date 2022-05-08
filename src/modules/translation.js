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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate_object = exports.detect_language = void 0;
const axios_1 = __importDefault(require("axios"));
const detectlanguage_1 = __importDefault(require("detectlanguage"));
const add_to_detection = (obj) => {
    let detections = [];
    for (var part in obj) {
        if (typeof (obj[part]) == "object") {
            detections.concat(add_to_detection(obj[part]));
        }
        else if (typeof (obj[part]) == "string") {
            detections.push(obj[part]);
        }
    }
    return detections;
};
const detect_language = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const detect_key = process.env.DETECT_KEY;
    if (!detect_key) {
        throw Error("Language detection key is missing!");
    }
    var detections = add_to_detection(obj);
    const detectLanguage = new detectlanguage_1.default(detect_key);
    const result = yield detectLanguage.detect(detections);
    var possibilities = new Map();
    for (var detect_list of result) {
        for (var detect_possibility of detect_list) {
            const prev = possibilities.get(detect_possibility.language) || 0;
            possibilities.set(detect_possibility.language, prev + detect_possibility.confidence);
        }
    }
    console.log(possibilities);
    var max = {
        name: "",
        possibility: 0
    };
    for (let [key, value] of possibilities) {
        if (value > max.possibility) {
            max.name = key;
            max.possibility = value;
        }
    }
    return max.name;
});
exports.detect_language = detect_language;
const translate_object = (obj, from, to) => __awaiter(void 0, void 0, void 0, function* () {
    for (var part in obj) {
        if (typeof (obj[part]) == "object") {
            obj[part] = yield (0, exports.translate_object)(obj[part], from, to);
        }
        else if (typeof (obj[part]) == "string" && !obj[part].startsWith("http")) {
            try {
                var resp = yield axios_1.default.post("http://localhost:5000/translate", { "q": obj[part], "source": from, "target": to }, { headers: { "Content-Type": "application/json" } });
                obj[part] = resp.data.translatedText;
            }
            catch (err) {
                console.log(err);
                return obj;
            }
        }
    }
    return obj;
});
exports.translate_object = translate_object;
