import axios from "axios"
import DetectLanguage from "detectlanguage"
import { JsonObject } from "swagger-ui-express"

const add_to_detection = (obj: JsonObject): string[] => {
    let detections: string[] = []
    for (var part in obj) {
        if (typeof(obj[part]) == "object") {
            detections.concat(add_to_detection(obj[part]))
        }
        else if (typeof(obj[part]) == "string") {
            detections.push(obj[part])
        }
    }
    return detections
}

export const detect_language = async (obj: JsonObject): Promise<string> => {
    const detect_key: string | undefined = process.env.DETECT_KEY
    if (!detect_key) {
        throw Error("Language detection key is missing!")
    }
    var detections = add_to_detection(obj)
    const detectLanguage : DetectLanguage = new DetectLanguage(detect_key)
    const result: any[] = await detectLanguage.detect(detections)

    var possibilities = new Map<string, number>()
    for (var detect_list of result) {
        for (var detect_possibility of detect_list) {
            const prev: number = possibilities.get(detect_possibility.language) || 0
            possibilities.set(detect_possibility.language, prev + detect_possibility.confidence)
        }
    }
    console.log(possibilities)
    var max = {
        name: "", 
        possibility: 0
    }
    for (let [key, value] of possibilities) {
        if (value > max.possibility) {
            max.name = key
            max.possibility = value
        }
    }
    return max.name
}

export const translate_object = async (obj: JsonObject, from: string, to: string):Promise<object> => {
    for (var part in obj) {
        if (typeof(obj[part]) == "object") {
            obj[part] = await translate_object(obj[part], from, to)
        }
        else if (typeof(obj[part]) == "string" && !obj[part].startsWith("http")) {
            try {
                // var resp = await axios.post("http://localhost:5000/translate", {"q": obj[part], "source" : from, "target": to}, {headers: { "Content-Type": "application/json" }})
                // obj[part] = resp.data.translatedText
                // var resp = await translate(obj[part], {tld: "gr", to: "zh-CN"})
            } catch (err) {
                console.log(err)
                return obj
            }
        }
    }
    return obj
}