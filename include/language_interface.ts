import internal from "stream";

export interface TranslationWord {
        id: string;
        known: number; 
        name: string; 
        products: number; 
        sameAs: string[] | undefined ; 
        url: string;
}