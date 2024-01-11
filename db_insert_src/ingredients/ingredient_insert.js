const checkInputBeforeSqlQuery = (arg) => {
    if (!arg || typeof arg != "string") { return ''; }
    arg = arg.replaceAll("'", "''");

    return arg;
};
const ingredients = require("./ingredient_taxo.json")
const fs = require("fs");

const is_vegan = (id) => {
    let vegan = null;
    let vegetarian = null;
    let palm_oil = false
    const jsson = ingredients[id];
    if (id == "en:palm-oil") {
        palm_oil = true
    }
    if (jsson.vegetarian != undefined) {
        vegetarian = false
        if (jsson.vegetarian.en == "yes") {
            vegetarian = true
        }
    }
    if (jsson.vegan != undefined) {
        vegan = false
        if (jsson.vegan.en == "yes") {
            vegan = true
        }
    }
    if (jsson.parents != undefined) {
        for (let parent of jsson.parents) {
            let tmp = is_vegan(parent)
            if (tmp.vegan == true && vegan == null) {
                vegan = true
            }
            if (tmp.vegetarian == true && vegetarian == null) {
                vegetarian = true
            }
            if (tmp.vegan == false) {
                vegan = false
                vegetarian = false
            }
            if (tmp.vegetarian == false) {
                vegetarian = false
            }
            if (tmp.palm_oil == true) {
                palm_oil = true
            }
        }
        return {vegan: vegan, vegetarian: vegetarian, palm_oil: palm_oil}
    }
    return {vegan: vegan, vegetarian: vegetarian, palm_oil: palm_oil}
}

const db_script_single_ingredient = (off_id, eng_name, frz_name, ger_name, vegetarian, vegan, palm_oil) => {
    return `
(
    '${checkInputBeforeSqlQuery(off_id)}',
    '${checkInputBeforeSqlQuery(eng_name)}',
    '${checkInputBeforeSqlQuery(frz_name)}',
    '${checkInputBeforeSqlQuery(ger_name)}',
    ${vegetarian},
    ${vegan},
    ${palm_oil}
)`
}

const get_trans = (id) => {
    const obj = ingredients[id].name
    let tmp = is_vegan(id)
    let one_ing = db_script_single_ingredient(id, obj.en, obj.fr, obj.de, tmp.vegetarian, tmp.vegan, tmp.palm_oil)
    return one_ing
}
const keys = Object.keys(ingredients)
let str = `
INSERT INTO ingredient(
	off_id, 
    eng_name, 
    frz_name, 
    ger_name, 
    vegetarian, 
    vegan, 
    palm_oil
    
)
VALUES ${get_trans(keys[0])}`
for (let i = 1; i < keys.length; i++) {
    str += `, ${get_trans(keys[i])}`
}
str += ";"
fs.writeFileSync("./ingredient.sql", str)