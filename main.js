'use strict';

/**
 * Récupère un élement HTML en fonction de `el`
 * @param {String} el - Selecteur
 */
const get = (selector) => {
    return document.querySelector(selector);
}

/**
 * Récupère tous les élements HTML en fonction du `selector`
 * @param {String} selector - Selecteur
 */
function getAll (selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return Array.prototype.slice.call(parent.querySelectorAll(selector), 0);
}

/**
 * Vérifie si le selecteur `element` possède la classe `className`
 * @param {String} element - Selecteur
 * @param {String} className - Nom de la classe à vérifier
 * @returns {Boolean}
 */
function hasClass (element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}

// SVG - Trash (Bootstrap Icons)
let deleteSvg = `
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
    </svg>
`;

// Initialisation des valeurs
let objectOfArrays = "", arrayToCompare = {};
const objectOfArraysInput = get('#objectOfArraysInput');

// Live check onInput
objectOfArraysInput.addEventListener("input", function (el) {
    objectOfArrays = this.value;
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
    let compareParsed = {};
    for (const [key, value] of Object.entries(compare)) {
        // console.log(key, value);
        compareParsed[key] = value.split(',').map(function (item) {
            return item.trim();
        });
    }
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
        let outputByTemplate = ``;

        thisArray.forEach((arrayValue, key) => {
            for (const [compareKey, compareKeyValue] of Object.entries(compareParsed)) {
                // console.log(`Key de l'array à comparer: ${compareKey};\n Ses valeurs:`, compareKeyValue);

                let thisArraySameCount = 0;

                compareKeyValue.forEach((compareValue, key) => {
                    if (arrayValue == compareValue && arrayValue != "") {
                        thisArraySameCount++;
                        outputByTemplate += `<p>${thisArray} -> ${thisArraySameCount} count dans ${compareKey}</p>`;
                    }
                })
            }
        })
        if (outputByTemplate != "") {
            output = outputByTemplate;
        }
    })

    results.innerHTML = output;
}

// Génération de modèles
const templateGenerated = get('#templateGenerated');
get('#addTemplate').addEventListener('click', () => {
    let count = 1;

    // Tant que l'ID choisie est déjà attribuée, changer l'ID
    while(document.contains(get(`#template-${count}`))) count++;

    let output = document.createElement('div');
        output.className = "field has-addons has-addons-centered";
        output.innerHTML = `
            <p class="control">
                <button class="button is-static">${count}</button>
            </p>
            <p class="control is-expanded">
                <input class="input isATemplateInput" type="text" placeholder="exemple: 1,5,2,4,3"
                    id="template-${count}"
                />
            </p>
            <p class="control">
                <button class="button is-danger" onClick="removeTemplate('#template-${count}')">${deleteSvg}</button>
            </p>
        `;
    templateGenerated.appendChild(output);
    refreshTemplatesListener();
});

/**
 * Enlève un modèle à partir de l'ID
 * @param {String} id - ID du modèle
 */
function removeTemplate (id) {
    var el = get(id);
    var parentEl =  el.parentNode;
    var divEl = parentEl.parentNode;

    divEl.remove();
    refreshTemplatesListener();
}

function refreshTemplatesListener () {
    // Réinitialisation des modèles
    arrayToCompare = {};
    
    // ForEach the inputs
    let allInputs = getAll('.isATemplateInput');
    allInputs.forEach(function (el) {
        // Récupérations des IDs
        let inputKeyFromID = el.id.replace('template-', '');

        // Refresh les valeurs
        arrayToCompare[inputKeyFromID] = el.value;

        // Refresh même onInput
        el.addEventListener('input', function (el) {
            arrayToCompare[inputKeyFromID] = this.value;
            check(objectOfArrays, arrayToCompare);

            /* Debug */ // console.log(`[refreshTemplates.input]\n`, arrayToCompare);
        });
    });

    console.log(`[refreshTemplates.output]\n`, arrayToCompare);
}