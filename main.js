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

// Initialisation des variables
let arrayListes = "", arrayModeles = "";

// Filtres par défauts
let filtres = {
    affichage: 'sum'
}

// Options CodeMirror
let codeMirrorOptions = {
    lineNumbers: true,
    mode: "htmlmixed",
    theme: "nord"
}

// CodeMirror sur l'input Modèle(s)
var arrayModelesInput = CodeMirror.fromTextArea(get('#arrayModelesInput'), codeMirrorOptions);

// Live check sur l'input Modèle(s)
arrayModelesInput.on("change", (cm) => { 
    arrayModeles = cm.getValue();
    check(arrayListes, arrayModeles, filtres);
})

// CodeMirror sur l'input Liste(s)
var arrayListesInput = CodeMirror.fromTextArea(get('#arrayListesInput'), codeMirrorOptions);

// Live check sur l'input Liste(s)
arrayListesInput.on("change", (cm) => { 
    arrayListes = cm.getValue();
    check(arrayListes, arrayModeles, filtres);
})

/**
 * Vérifie tous les arrays de l'object avec l'array modèle et retourne les arrays qui correspondent.
 * @param {String} listes - String de toutes les listes tapées 
 * (chaque liste séparée par un (\r)\n et chaque valeur par une virgule)
 * @param {String} modeles - String de tous les modèles tapés 
 * (chaque modèle séparé par un (\r)\n et chaque valeur par une virgule)
 * @returns {Array}
 */
function check (listes, modeles, filters) {
    /** Explications
     * 1 - Séparation à chaque retour à la ligne.
     * 2 - Création d'un nouvel Array.
     * 3.1 - Pour chaque ligne, 
     * 3.2 - Séparer à chaque virgule;
     * 3.3 - .trim() chaque valeur et l'ajouter dans l'Array final.
     */

    // Liste(s) //
    /* 1 */ let listesArrayOfString = listes.split(/\r?\n/g);
    /* 2 */ let listesParsed = [];
    /* 3.1 */ listesArrayOfString.forEach((arrayVal, arrayKey) => {
    /* 3.2 */    listesParsed.push(arrayVal.split(','))
    /* 3.3 */    listesParsed[arrayKey].forEach((val, key) => listesParsed[arrayKey][key] = val.trim())
    });

    // Modèle(s) //
    /* 1 */ let modelesArrayOfString = modeles.split(/\r?\n/g);
    /* 2 */ let modelesParsed = [];
    /* 3.1 */ modelesArrayOfString.forEach((arrayVal, arrayKey) => {
    /* 3.2 */    modelesParsed.push(arrayVal.split(','))
    /* 3.3 */    modelesParsed[arrayKey].forEach((val, key) => modelesParsed[arrayKey][key] = val.trim())
    });

    // Retour //
    // Initialisation des valeurs de retour.
    let returnDiv = get('#return'), output;

    // Vérification des filtres.
    switch (filters.affichage) {
        // Addition des résultats entre modèles.
        case 'sum':
            output = orderBySum(listesParsed, modelesParsed);
            break;
    }

    // Retour du résultat.     
    returnDiv.innerHTML = output;
}

/**
 * Retourne les résultats du check en vérifiant toutes les listes
 * avec tous les modèles et en additionnant les résultats.
 * @param {Array} listes - Toutes les listes (en array de chaques)
 * @param {Array} modeles - Tous les modèles (en dict {1: []...})
 */
function orderBySum (listes, modeles) {
    let output = ``;

    


    // Pour chaque listes, récupérer les lignes
    for (const [listeArrayKey, listeArrayValues] of Object.entries(listes)) {
        let thisListCount = 0;
        // Pour chaque valeurs d'une liste
        listeArrayValues.forEach((listeValue, listeKeyofValue) => {
            // Pour chaque modèles, récupérer les lignes
            for (const [modeleArrayKey, modeleArrayValues] of Object.entries(modeles)) {
                // Pour chaque valeurs d'un modèle
                modeleArrayValues.forEach((modeleValue, modeleKeyofValue) => {
                    // Si la valeur du modèle est égale à une valeur
                    // de la liste, alors ajouter 1 à l'indicateur de la liste
                    if (listeValue == modeleValue && listeValue != "") {
                        thisListCount++;
                    }
                })
            }
        })

        if (thisListCount > 0)
            output += `
                <p><code class="code">${parseInt(listeArrayKey) + 1}</code> contient <b>${thisListCount}</b> correspondances pour tous les modèles.</p>
            `;
    }

    return output;
}

////////////
// Bulma CSS
var rootEl = document.documentElement;
var $modals = getAll('.modal');
var $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

if ($modalCloses.length > 0) {
    $modalCloses.forEach(function ($el) {
        $el.addEventListener('click', function () {
            closeModals();
        });
    });
}

function openModal(target) {
    var $target = document.getElementById(target);
    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
}

function closeModals() {
    rootEl.classList.remove('is-clipped');
    $modals.forEach(function ($el) {
        $el.classList.remove('is-active');
    });
}

document.addEventListener('keydown', function (event) {
    var e = event || window.event;
    (e.keyCode === 27) && closeModals();
});

