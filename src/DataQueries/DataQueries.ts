import { TSearchParameters, THistData, TArticlesList, TDocument } from '../AppContext'


type TLoginResult = {
    accessToken: string,
    expire: string,
    errorCode: string,
    message: string
}

type TFiltersInfo= {
    eventFiltersInfo: {
        usedCompanyCount: number,
        companyLimit: number
      }    
}

const url = "https://gateway.scan-interfax.ru/api/v1";

// получение сохраненного токена авторизации
export function getSavedToken(): string {
    const token = localStorage.getItem("token");
    const expire = localStorage.getItem("expire");
    const expireDate = expire ? Date.parse(expire) : null;
    const currrentDate = new Date().getTime();
    const currentToken = (token && (expireDate && expireDate > currrentDate)) ? token : '';

    return currentToken;
}

// проверка статус аавторизации
export function isAuthorised(): boolean {
    return getSavedToken() ? true : false;
}

// получение данных для авторизации
export async function submitLoginInfo (username:string, pass:string) {

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: username,
            password: pass
        }) 
    }
        
    const fetchedData = await fetch(`${url}/account/login`, settings).then(
        (response) => {
            return response
        }).catch(() => {
            return new Response(JSON.stringify({errorCode: "NetworkError", message: 'Network error'}))
        });
    
    const authData:TLoginResult = await fetchedData.json();

    if (authData.accessToken) {
        localStorage.setItem("token", authData.accessToken);
        localStorage.setItem("expire", authData.expire);
        return 1;
    } else if  (authData.errorCode) {
        if (authData.errorCode === "NetworkError") {
            alert("Нет доступа к серверу");
        } else {
            alert(authData.message);
        }
    } else {
        throw(new Error("Или нет ответа от сервера или он абсолютно непонятен"));
    }

    return 0;
}

/* получение данных об использованном количестве и лимите */
export async function getAccountInfo() {
    
    const savedToken = getSavedToken();

    if(savedToken) {
        const settings = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${savedToken}`
            } 
        }

        const fetchedData = await fetch(`${url}/account/info`, settings).then(
            (response) => {
                return response
            }).catch(() => {
                return new Response(JSON.stringify({errorCode: "NetworkError", message: 'Network error'}))
            });
        
        const filtersData:TFiltersInfo = await fetchedData.json();
        if (filtersData.eventFiltersInfo && filtersData.eventFiltersInfo.companyLimit) {
            return filtersData.eventFiltersInfo;
        } else {
            return {
                usedCompanyCount: 0,
                companyLimit: 0
            }
        }
    } else {
        return {
            usedCompanyCount: 0,
            companyLimit: 0
        }
    }
}

// получение результатов поиска информации о компаниях
export async function getHistData(formData:TSearchParameters):Promise<THistData> {

    const savedToken = getSavedToken();
    
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`
        },
        body: JSON.stringify({
            "issueDateInterval": {
                "startDate": formData.fromDate + "T00:00:00+03:00",
                "endDate": formData.toDate + "T23:59:59+03:00"
            },
            "searchContext": {
                "targetSearchEntitiesContext": {
                    "targetSearchEntities": [
                        {
                            "type": "company",
//                            "sparkId": null,
//                            "entityId": null,
                            "inn": formData.inn,
                            "maxFullness": formData.maxComplete,
                            "inBusinessNews": formData.busMention
                        }
                    ],
                    "onlyMainRole": formData.mainRole,
                    "tonality": formData.ton,
                    "onlyWithRiskFactors": formData.onlyRisky,
/*                    "riskFactors": {
                        "and": [],
                        "or": [],
                        "not": []
                    },*/
/*                    "themes": {
                        "and": [],
                        "or": [],
                        "not": []
                    }*/
                },
                "themesFilter": {
                    "and": [],
                    "or": [],
                    "not": []
                }
            },
/*            "searchArea": {
                "includedSources": [],
                "excludedSources": [],
                "includedSourceGroups": [],
                "excludedSourceGroups": []
            },*/
            "attributeFilters": {
                "excludeTechNews": !formData.inclTech,
                "excludeAnnouncements": !formData.inclAnno,
                "excludeDigests": !formData.inclNews
            },
            "similarMode": "duplicates",
            "limit": formData.docQty,
            "sortType": "sourceInfluence",
            "sortDirectionType": "desc",
            "intervalType": "month",
            "histogramTypes": [
                "totalDocuments",
                "riskFactors"
            ]
        }) 
    }

    const fetchedData = await fetch(`${url}/objectsearch/histograms`, settings).then(
        (response) => {
            return response
        }).catch(() => {
            return new Response(JSON.stringify({errorCode: "NetworkError", message: 'Network error'}))
        }
    )

    return await fetchedData.json();

}

export async function getDocs(ids:string[]):Promise<TDocument[]> {
    const savedToken = getSavedToken();
    
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`
        },
        body: JSON.stringify({
            ids: ids
        })
    }
    const fetchedData = await fetch(`${url}/documents`, settings).then(
        (response) => {
            return response
        }).catch(() => {
            return new Response(JSON.stringify({errorCode: "NetworkError", message: 'Network error'}))
        }
    )

    return await fetchedData.json();
}

// получение результатов поиска информации о компаниях
export async function getArticleListData(formData:TSearchParameters):Promise<TArticlesList> {
//export async function getArticleListData(formData:TSearchParameters) {
    const savedToken = getSavedToken();
    
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${savedToken}`
        },
        body: JSON.stringify({
            "limit": formData.docQty,
            "sortType": "sourceInfluence",
            "sortDirectionType": "desc",
            //"dedupClusterId": "string",
            "issueDateInterval": {
                "startDate": formData.fromDate + "T00:00:00+03:00",
                "endDate": formData.toDate + "T23:59:59+03:00",
            },            
            "searchContext": {
                "targetSearchEntitiesContext": {
                    "targetSearchEntities": [
                        {
                            "type": "company",
/*                            "sparkId": null,
                            "entityId": null,*/
                            "inn": formData.inn,
                            "maxFullness": formData.maxComplete,
                            "inBusinessNews": formData.busMention
                        }
                    ],
                    "onlyMainRole": formData.mainRole,
                    "tonality": formData.ton,
                    "onlyWithRiskFactors": formData.onlyRisky,
/*                    "riskFactors": {
                        "and": [],
                        "or": [],
                        "not": []
                    },*/
/*                    "themes": {
                        "and": [],
                        "or": [],
                        "not": []
                    },*/
                },
/*                "searchEntitiesFilter": {
                    "and": [],
                    "or": [],
                    "not": []
                },
                "locationsFilter": {
                    "and": [],
                    "or": [],
                    "not": []
                },
                "themesFilter": {
                    "and": [],
                    "or": [],
                    "not": []
                }*/
            },
/*            "searchArea": {
                "includedSources": [],
                "excludedSources": [],
                "includedSourceGroups": [],
                "excludedSourceGroups": []
            },*/
            "attributeFilters": {
                "excludeTechNews": !formData.inclTech,
                "excludeAnnouncements": !formData.inclAnno,
                "excludeDigests": !formData.inclNews
            },
            "similarMode": "duplicates"
        }) 
    }

    const fetchedData = await fetch(`${url}/objectsearch`, settings).then(
        (response) => {
            return response
        }).catch(() => {
            return new Response(JSON.stringify({errorCode: "NetworkError", message: 'Network error'}))
        }
    )

    return await fetchedData.json();

}


/* заглушка получения текущего тарифа, так как в API не нашлось подходящего запроса*/
export function getCurrentTarrife() {
    if (getSavedToken()) {
        return "Pro";
    } else {
        return "";
    }
    
}

/* заглушка получения автара пользователя, так как в API не нашлось подходящего запроса*/
export function getUserProperties() {
    return {userIcon: "/img/usericon.png"};
}
