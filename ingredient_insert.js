// import Database, { db_adm_conn } from './src/modules/db';
// import { app, database, init_db, init_jwt, init_mail, JWT } from './server_config'
// import ingredients from "./ingredients.json"
// init_db(Database)
// database.connect()


// await db_adm_conn.query(`
//             INSERT INTO Feedback (reason, content, userhash)
//             VALUES ('${checkInputBeforeSqlQuery(reason)}', '${checkInputBeforeSqlQuery(content)}', '${checkInputBeforeSqlQuery(Md5.hashStr(userid))}');
//         `);

const ingredients = require("./ingredient_taxo.json")
const de = require("./src/modules/translation/de.json")
const en = require("./src/modules/translation/en.json")
const fr = require("./src/modules/translation/fr.json")
const it = require("./src/modules/translation/it.json")
const axios = require("axios")

const trans = {
    de: de.tags,
    en: en.tags,
    fr: fr.tags,
    it: it.tags
}

const is_vegan = (id) => {
    let vegan = "undefined";
    let vegetarian = "undefined";
    let palm_oil = false
    const jsson = ingredients[id];
    if (id == "en:palm-oil") {
        palm_oil = true
    }
    if (jsson.vegetarian != undefined) {
        vegetarian = jsson.vegetarian.en
    }
    if (jsson.vegan != undefined) {
        vegan = jsson.vegan.en
    }
    if (jsson.parents != undefined) {
        for (let parent of jsson.parents) {
            let tmp = is_vegan(parent)
            if (tmp.vegan == "yes" && vegan == "undefined") {
                vegan = "yes"
            }
            if (tmp.vegetarian == "yes" && vegetarian == "undefined") {
                vegetarian = "yes"
            }
            if (tmp.vegan == "no") {
                vegan = "no"
                vegetarian = "no"
            }
            if (tmp.vegetarian == "no") {
                vegetarian = "no"
            }
            if (tmp.palm_oil == true) {
                palm_oil = true
            }
        }
        return {vegan: vegan, vegetarian: vegetarian, palm_oil: palm_oil}
    }
    return {vegan: vegan, vegetarian: vegetarian, palm_oil: palm_oil}
}

const get_trans = async (id) => {
    const german = trans.de.find(item => { return item.id == id } ) || "none"
    const frensh = trans.fr.find(item => { return item.id == id } ) || "none"
    const italian = trans.it.find(item => { return item.id == id } ) || "none"
    const english = trans.en.find(item => { return item.id == id } ) || "none"
    const obj = ingredients[id]
    console.log(id, obj.name.en, obj.name.de, obj.name.it, is_vegan(id))
}
const keys = Object.keys(ingredients)
for (let i = 0; i < 30; i++) {
    get_trans(keys[i])
}
get_trans("en:mixture-of-palm-oil-and-palm-superolein")