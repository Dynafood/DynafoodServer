import german_ingreds from './de.json' 
import italian_ingreds from './it.json' 
import frensh_ingreds from './fr.json' 
import english_ingreds from './en.json' 


export const translations = [
    {id: "de", translation: german_ingreds},
    {id: "it", translation: italian_ingreds},
    {id: "fr", translation: frensh_ingreds},
    {id: "en", translation: english_ingreds}
]

export const translate = (en_word: string, language: string = "de") : null | string =>  {
    var tags: Array<({ id: string; known: number; name: string; products: number; sameAs: string[]; url: string; } | { id: string; known: number; name: string; products: number; url: string; sameAs?: undefined; })> = []

    for (var it of translations) {
        if (it.id == language) {
            tags = it.translation.tags
        }
    }
    for (var word of tags) {
        if (word.id === en_word) {
            return word.name
        }
    }
    return null
}

// export const translate_ingredients = (attr: { name: string, vegan: boolean, vegetarian: boolean, ingredients: Array<any> }) => {
//     for (var sub_attr of attr.ingredients) {
//         translate_ingredients(sub_attr)
//     }
// }