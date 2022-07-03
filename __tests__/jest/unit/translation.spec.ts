import  {translate_ingredient, translate_nutriment} from '../../../src/modules/translation/translation'

describe('test ingredient translation', () => {
    test('translate real ingredient fr', async () => {
        const response = translate_ingredient('en:sugar', "fr")
        expect(response).toBe("Sucre")
    })
    test('translate real ingredient de', async () => {
        const response = translate_ingredient('en:sugar', "de")
        expect(response).toBe("Zucker")
    })
    test('translate real ingredient it', async () => {
        const response = translate_ingredient('en:sugar', "it")
        expect(response).toBe("Zucchero")
    })
    test('translate real ingredient en', async () => {
        const response = translate_ingredient('en:sugar', "en")
        expect(response).toBe("Sugar")
    })
    test('translate real ingredient default', async () => {
        const response = translate_ingredient('en:sugar')
        expect(response).toBe("Sugar")
    })

    test('translate real ingredient gr', async () => {
        const response = translate_ingredient('en:sugar', "gr")
        expect(response).toBe(null)
    })
    test('translate non existing ingredient de', async () => {
        const response = translate_ingredient('en:test', "de")
        expect(response).toBe(null)
    })
    test('translate non existing ingredient default', async () => {
        const response = translate_ingredient('en:test', "en")
        expect(response).toBe(null)
    })
})

describe('test nutriment translation', () => {
    test('translate real nutriment fr', async () => {
        const response = translate_nutriment('carbohydrates', "fr")
        expect(response).toBe("les glucides")
    })
    test('translate real nutriment de', async () => {
        const response = translate_nutriment('carbohydrates', "de")
        expect(response).toBe("Kohlenhydrate")
    })
    test('translate real nutriment it', async () => {
        const response = translate_nutriment('carbohydrates', "it")
        expect(response).toBe("carboidrati")
    })
    test('translate real nutriment en', async () => {
        const response = translate_nutriment('carbohydrates', "en")
        expect(response).toBe("carbohydrates")
    })
    test('translate real nutriment default', async () => {
        const response = translate_nutriment('carbohydrates')
        expect(response).toBe("carbohydrates")
    })

    test('translate real nutriment gr', async () => {
        const response = translate_nutriment('carbohydrates', "gr")
        expect(response).toBe('carbohydrates')
    })
    test('translate non existing nutriment de', async () => {
        const response = translate_nutriment('testamisti', "de")
        expect(response).toBe('testamisti')
    })
    test('translate non existing nutriment default', async () => {
        const response = translate_nutriment('testamisti', "en")
        expect(response).toBe('testamisti')
    })
})