import { createContext } from 'react';

export type TAppData = {
    loginName: string,
    userName: string
}

const appData:TAppData = {
    loginName: "",
    userName: "",
}

export type THistData = {
    data: {
        data: {
            date: string,
            value: number
            }[],
        histogramType: string
        }[],
    errorCode: string,
    message: string
} | undefined;

export type TSearchParameters = {
    [key: string]: string | boolean,
    inn: string,
    ton: string,
    docQty: string,
    fromDate: string,
    toDate: string,
    maxComplete: boolean,
    busMention: boolean,
    mainRole: boolean,
    onlyRisky: boolean,
    inclTech: boolean,
    inclAnno: boolean,
    inclNews: boolean
}

export type TArticleAttributes =  {
    isTechNews: boolean,
    isAnnouncement: boolean,
    isDigest: boolean,
    isSpeechRecognition: boolean,
    influence: number,
    wordCount: number,
    coverage: {
        value: number,
        state: string
    }
}

export type TArticlesList = {
    items: [
        {
            encodedId: string,
            influence: number,
            similarCount: number
        }
    ],
    mappings: [
        {
            sparkId: number,
            inn: string,
            entityIds: number[]
        }
    ]
    errorCode: string,
    message: string
} | undefined;

export type TDocument = {
    ok: {
        schemaVersion: string,
        id: string,
        version: 0,
        issueDate: string,
        url: string,
        author: {
            name: string
        },
        source: {
            id: number,
            groupId: number,
            name: string,
            categoryId: number,
            levelId: number,
            distributionMethodId: number
        },
        dedupClusterId: string,
        plotClusterId: string,
        title: {
            text: string,
            markup: string
        },
        content: {
            markup: string
        },
        entities: {
            companies: {
                suggestedCompanies: {
                    sparkId: number,
                    inn: string,
                    ogrn: string,
                    searchPrecision: string
                }[],
                resolveInfo: {
                    resolveApproaches: string[]
                },
                tags: string[],
                isSpeechAuthor: boolean,
                localId: number,
                name: string,
                entityId: number,
                isMainRole: boolean
            } [],
            people: {
                rotatedName: string,
                tags: string[],
                isSpeechAuthor: boolean,
                localId: number,
                name: string,
                entityId: number,
                isMainRole: boolean
            } [],
            themes: {
                localId: number,
                name: string,
                entityId: number,
                tonality: string,
                participant: {
                localId: number,
                type: string
                }
            } [],
            locations: {
                code: {
                    countryCode: string,
                    regionCode: string
                },
                localId: number,
                name: string,
                entityId: number,
                isMainRole: boolean
            }[]
        },
        attributes: {
            isTechNews: boolean,
            isAnnouncement: boolean,
            isDigest: boolean,
            isSpeechRecognition: boolean,
            influence: number,
            wordCount: number,
            coverage: {
                value: number,
                state: string
            }
        },
        language: string
    },
    fail: {
        id: string,
        errorCode: 0,
        errorMessage: string
    }
};


const searchParameters = {
    inn: "",
    ton: "any",
    docQty: "",
    fromDate: "",
    toDate: "",
    maxComplete: false,
    busMention: false,
    mainRole: false,
    onlyRisky: false,
    inclTech: false,
    inclAnno: false,
    inclNews: false
}

export function declOfNum(number:number, titles:string[]) {  // thanks to https://gist.github.com/realmyst/1262561
    const cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

export const AppContext = createContext(appData);
export const SearchFormContext = createContext(searchParameters);

