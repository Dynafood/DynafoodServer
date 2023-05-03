import { db_adm_conn } from "../../db";
import my_json from '../translationFiles/my_result.json'
console.log(my_json)

export const translate_ingredients = async () => {
    for (const ingredient of my_json.array) {
        await db_adm_conn.query(`UPDATE public.ingredient
        SET eng_name=${ingredient.en}, frz_name=${ingredient.fr}, ger_name=${ingredient.ge},
        WHERE off_id=${ingredient.id}`);
        break;
    } 
}
