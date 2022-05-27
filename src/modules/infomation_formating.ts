
import { JsonObject } from 'swagger-ui-express';

export const remove_underscore = (oldstring : string) : string => {

    return oldstring.replace(/[_]/g," "); 
}

export const specifiqueWordWithCapitalLetter = (oldstring : string) : string => {
    oldstring.replace("test","Test");
    oldstring.replace("test2","Test2");
    
    return oldstring;
}

export const allIngredientWithCapitalLetter = (ingredient : Array<JsonObject>) : Array<JsonObject> => {

    ingredient.forEach(element => {
        element = element[0].toUpperCase() + element.substring(1);
    });

    return ingredient;
}
