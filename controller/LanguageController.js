
// const sanitizeHtml = require("sanitize-html");


import sanitizeHtml from 'sanitize-html';
import leoProfanity from "leo-profanity";

leoProfanity.loadDictionary();

const normalizeText = (text) => text.trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

const sanitizeInput = (input) => sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });

const sanitizeAndNormalize = (text) => normalizeText(sanitizeInput(text));

export const cleanAndFilterText = (text) =>{

    const cleanedText=sanitizeAndNormalize(text);
    if (leoProfanity.check(cleanedText)){
        return false;
    }
    else{
        return cleanedText;
    }
}