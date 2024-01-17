import german_ingreds from './de.json' 
import italian_ingreds from './it.json' 
import frensh_ingreds from './fr.json' 
import english_ingreds from './en.json' 
import portugese_ingreds from './pl.json' 
import spanish_ingreds from './es.json' 
import netherlands_ingreds from './nt.json' 

export const INGREDIENT_TRANSLATION = [
    german_ingreds,
    italian_ingreds,
    frensh_ingreds,
    english_ingreds,
    portugese_ingreds,
    spanish_ingreds,
    netherlands_ingreds
]

export const LANGUAGES  = [
    "de",
    "it",
    "fr",
    "en",
    "pt",
    "es",
    "nt"
]

export const NUTRIMENT_TRANSLATION = [
    {id: 'calcium',       translation:['Kalzium',              'calcio'        ,   'calcium',       'calcium',      'Cálcio',          'calcio'       ,'calcium']},
    {id: 'carbohydrates', translation:['Kohlenhydrate',        'carboidrati'   ,   'les glucides',  'carbohydrates','Kohlenidrato',    'carbohidratos','koolhydraten']},
    {id: 'cholesterol',   translation:['Cholesterin',          'colesterolo'   ,   'cholestérol',   'cholesterol',  'Colesterina',     'colesterol'   ,'cholesterol']},
    {id: 'kcal',          translation:['kcal',                 'kcal'          ,   'kcal',          'kcal',         'calorias',        'calorías'     ,'kcal']},
    {id: 'fat',           translation:['Fett',                 'Grasso'        ,   'gros',          'fat',          'Fet',             'Gordo'        ,'Vet']},
    {id: 'fiber',         translation:['Ballaststoffe',        'fibra'         ,   'fibre',         'fiber',        'Balastro',        'fibra'        ,'vezel']},
    {id: 'iron',          translation:['Eisen',                'ferro da stiro',   'le fer',        'iron',         'Eisen',           'hierro'       ,'ijzer']},
    {id: 'proteins',      translation:['Eiweiße',              'proteine'      ,   'protéines',     'proteins',     'Eiweiße',         'proteínas'    ,'eiwitten']},
    {id: 'salt',          translation:['Salz',                 'Sale'          ,   'sel',           'salt',         'sal',             'Sal'          ,'Zout']},
    {id: 'saturated fat', translation:['gesättigte Fettsäuren','grassi saturi' ,   'saturé',        'saturated fat','gordura saturada','saturado'     ,'verzadigde vetzuren']},
    {id: 'sodium',        translation:['Natrium',              'sodio'         ,   'sodium',        'sodium',       'Sódio',           'sodio'        ,'natrium']},
    {id: 'sugars',        translation:['Zucker',               'zucchero'      ,   'sucres',        'sugars',       'Zucker',          'Azúcar'       ,'Suiker']},
    {id: 'trans fat',     translation:['Transfett',            'grasso trans'  ,   'trans',         'trans fat',    'Transfett',       'Grasas trans' ,'Trans vet']},
    {id: 'vitamin A',     translation:['Vitamin A',            'Vitamina A'    ,   'vitamine A',    'vitamin A',    'vitamina A',      'Vitamina A'   ,'vitamine A']},
    {id: 'vitamin B',     translation:['Vitamin B',            'Vitamina B'    ,   'vitamine B',    'vitamin B',    'vitamina B',      'Vitamina B'   ,'vitamine B']},
    {id: 'vitamin C',     translation:['Vitamin C',            'Vitamina C'    ,   'vitamine C',    'vitamin C',    'vitamina C',      'Vitamina C'   ,'vitamine C']},
    {id: 'vitamin D',     translation:['Vitamin D',            'Vitamina D'    ,   'vitamine D',    'vitamin D',    'vitamina D',      'Vitamina D'   ,'vitamine D']},
    {id: 'vitamin E',     translation:['Vitamin E',            'Vitamina E'    ,   'vitamine E',    'vitamin E',    'vitamina E',      'Vitamina E'   ,'vitamine E']},
]

export const get_language_key = (language: string) : number => {
    for (var i = 0; i < LANGUAGES.length; i++) {
        if (LANGUAGES[i] === language) {
            return i;
        }
    }
    return -1;
}

export const translate_ingredient = (en_word: string, language: string = "en") : null | string =>  {
    var tags: Array<({ id: string; known: number; name: string; products: number; sameAs: string[]; url: string; } | { id: string; known: number; name: string; products: number; url: string; sameAs?: undefined; })> = []

    var lang_key = get_language_key(language);
    if (lang_key < 0) {
        return null;
    } 
    tags = INGREDIENT_TRANSLATION[lang_key].tags;
    for (var word of tags) {
        if (word.id === en_word) {
            return word.name;
        }
    }
    return null
}

export const translate_nutriment = (nutriment: string, language: string = "en") : string =>  {
    var lang_key = get_language_key(language);
    if (lang_key < 0) {
        return nutriment;
    } 
    for (var nutriment_it of NUTRIMENT_TRANSLATION) {
        if (nutriment_it.id === nutriment) {
            return nutriment_it.translation[lang_key];
        }
    }
    return nutriment
}