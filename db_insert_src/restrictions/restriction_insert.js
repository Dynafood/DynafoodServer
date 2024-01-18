const checkInputBeforeSqlQuery = (arg) => {
    if (!arg || typeof arg != "string") { return ''; }
    arg = arg.replaceAll("'", "''");

    return arg;
};
const de = require("./restrictions_de.json")
const en = require("./restrictions_en.json")
const fr = require("./restrictions_fr.json")

const fs = require("fs");
const trans = {
    de: de.tags,
    en: en.tags,
    fr: fr.tags,
}

const db_script_single_ingredient = (off_id, eng_name, frz_name, ger_name) => {
    return `
(
    '${checkInputBeforeSqlQuery(off_id)}',
    '${checkInputBeforeSqlQuery(eng_name)}',
    '${checkInputBeforeSqlQuery(frz_name)}',
    '${checkInputBeforeSqlQuery(ger_name)}'
)`
}

const get_name = (name, id) => {
    if (name == id) {
        return ""
    }
    return name
}

const get_trans = (id) => {
    const en = trans.en.find(ingred => {return ingred.id == id}) || ""
    const fr = trans.fr.find(ingred => {return ingred.id == id}) || ""
    const de = trans.de.find(ingred => {return ingred.id == id}) || ""

    let one_ing = db_script_single_ingredient(id, get_name(en.name, id), get_name(fr.name, id), get_name(de.name, id))
    return one_ing
}
const keys = en.tags
let str = `
INSERT INTO restriction(
	off_id, 
    eng_name, 
    frz_name, 
    ger_name    
)
VALUES ${get_trans(keys[0].id)}`
for (let i = 1; i < keys.length; i++) {
    str += `, ${get_trans(keys[i].id)}`
}
str += ";"
fs.writeFileSync("./restriction.sql", str)