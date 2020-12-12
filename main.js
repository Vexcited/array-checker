'use strict';

const get = (selector) => {
    return document.querySelector(selector);
}

let objectOfArrays = "", arrayToCompare = "";
const objectOfArraysInput = get('#objectOfArraysInput');
const arrayToCompareInput = get('#arrayToCompareInput');

// Live check onInput
objectOfArraysInput.addEventListener("input", function (el) {
    objectOfArrays = this.value;
    check(objectOfArrays, arrayToCompare);
});
arrayToCompareInput.addEventListener("input", function (el) {
    arrayToCompare = this.value;
    check(objectOfArrays, arrayToCompare);
});

/**
 * Vérifie tous les arrays de l'object avec l'array modèle et retourne les arrays qui correspondent.
 * @param {String} object - Object de tous les arrays à vérifier (chaque arrays séparés par un \n et chaque valeur par une virgule)
 * @param {String} compare - Array modèle (chaque valeur séparés par une virgule)
 * @returns {Array}
 */
function check (object, compare) {
    // Manipulation des valeurs

    /**
     * Séparation du modèle par virgules.
     * Escape la valeur avec trim().
     */
    let compareParsed = compare.split(',');
    compareParsed.forEach ((val, key) => compareParsed[key] = val.trim());
    /* Debug */ // console.log(`[check.compareParsed] Array modèle découpé par virugles\n`, compareParsed);

    // Séparation de l'input à chaque virgule
    let objectArraysNotParsed = object.split(/\r?\n/g);
    /* Debug */ // console.log(`[check.objectArraysNotParsed] Arrays découpés par lignes\n`, objectArraysNotParsed);

    /**
     * Création d'un objet temporaire (objectParsed)
     * Pour chaque array, l'ajouter dans l'objet temp.
     * Séparer le string de chaque array par une virgule.
     * Escape les valeurs avec trim().
     * Ajouter ces nouvelles valeurs dans l'objet temporaire (objectParsed)
     */
    let objectParsed = [];
    objectArraysNotParsed.forEach((arrayVal, arrayKey) => {
        objectParsed.push(arrayVal.split(','))
        objectParsed[arrayKey].forEach((val, key) => objectParsed[arrayKey][key] = val.trim())
    });
    /* Debug */ // console.log(`[check.objectParsed] Object d'arrays découpés par lignes et par virgules\n`, objectParsed);

    // Vérification w/(objectParsed, compareParsed)
    let results = get('#return');
    let output = ``;

    objectParsed.forEach((thisArray, thisArrayKey) => {
        let thisArraySameCount = 0;
        // let thisArraySameVal = [];
        thisArray.forEach((arrayValue, key) => {
            compareParsed.forEach((compareValue, key) => {
                (arrayValue == compareValue && arrayValue != "") && thisArraySameCount++;
                // thisArraySameVal.push([arrayValue, key]);
            })
        })
        if (thisArraySameCount > 0) {
            output += `<p>${thisArray} -> <b>${thisArraySameCount}</b> correspondance(s)</p>`;
        }
    })

    results.innerHTML = output;
}