import {BSHConfiguration} from './configuration.js';
import {generateBirthPlace,
        getBackgrounds,
        getOriginKeys} from './origins.js';

/**
 * A constant outlining attribute scores obtained from a 2d6 roll.
 */
const ROLL_TABLE = {
    2:  8,
    3:  8,
    4:  9,
    5:  9,
    6:  10,
    7:  10,
    8:  11,
    9:  11,
    10: 12,
    11: 12,
    12: 13
};

/**
 * A constant containing the list of origin values.
 */
const ORIGINS = ["barbarian", "civilized", "decadent"];

/**
 * Returns an array of background after filtering by a number of criteria (i.e.
 * origin, whether uniques are allowed and what backgrounds are excluded).
 */
function filterBackgroundsByOrigin(origins, allowUniques, ignoreList) {
    return(getBackgrounds(...origins).filter((background) => {
        return((allowUniques || !background.unique) && !ignoreList.includes(background.key));
    }));
}

/**
 * Generates an array of attribute scores for a character. Returns a promise
 * that yields a JS object containing the attributes scores when resolved.
 */
function generateAttributeScores() {
    let attributes = {};

    return(generateAttributeScore()
        .then((roll) => {
            attributes.strength = roll;
            return(generateAttributeScore());
        })
        .then((roll) => {
            attributes.dexterity = roll;
            return(generateAttributeScore());
        })
        .then((roll) => {
            attributes.constitution = roll;
            return(generateAttributeScore());
        })
        .then((roll) => {
            attributes.intelligence = roll;
            return(generateAttributeScore());
        })
        .then((roll) => {
            attributes.wisdom = roll;
            return(generateAttributeScore());
        })
        .then((roll) => {
            attributes.charisma = roll;
            return(attributes);
        }));
}

/**
 * Generate an attribute score by rolling 2d6 and looking up the result in the
 * ROLL_TABLE. Returns a promise that yields the score when resolved.
 */
function generateAttributeScore() {
    let dice = new Roll("2d6");

    return(dice.evaluate({async: true})).then((roll) => ROLL_TABLE[`${roll.total}`]);
}

/**
 * Selects a background option within the context of a set of parameters (e.g.
 * whether a unique background may be selected or whether there are backgrounds
 * that should not be selected). Returns a promise the yields the background
 * selected when resolved.
 */
function generateBackground(origins, allowUniques, ignoreList) {
    let options = filterBackgroundsByOrigin(origins, allowUniques, ignoreList);
    return((new Roll(`1d${options.length}-1`)).evaluate({async: true}).then((roll) => {
        return(options[roll.total]);
    }));
}

/**
 * Randomly generates all of the basic aspects of a character.
 */
export function randomizeCharacter(actor) {
    let data = {attributes: {
                    strength:     0,
                    dexterity:    0,
                    constitution: 0,
                    intelligence: 0,
                    wisdom:       0,
                    charisma:     0
                },
                backgrounds: {
                    first: "",
                    second: "",
                    third:  ""
                },
                birth: "",
                coins: {first: 0},
                origin: ""};

    generateAttributeScores()
        .then((attributes) => {
            data.attributes = attributes;
            return(randomOrigin());
        })
        .then((origin) => {
            data.origin = origin;
            return(generateBirthPlace(origin))
        })
        .then((birthPlace) => {
            data.birth = birthPlace;
            return(selectBackgrounds(data.origin));
        })
        .then((backgrounds) => {
            data.backgrounds = backgrounds;
            switch(data.origin) {
                case "barbarian":
                    data.coins.first = 25;
                    break;

                case "civilized":
                    data.coins.first = 50;
                    break;

                default:
                    data.coins.first = 100;
            }
            return(data);
        })
        .then(async (data) => {
            await actor.update({system: data}, {diff: true});
        });
}

/**
 * Randomly selects an origin, returning a promise that will yield the origin
 * selected.
 */
function randomOrigin() {
    let keys = getOriginKeys();

    return(new Roll(`1d${keys.length}-1`)).evaluate({async: true}).then((roll) => {
        return(keys[roll.total]);
    });
}

/**
 * Selects a triplet of backgrounds for a character. Returns a promise that
 * yields an JS object containing the selected backgrounds under the first,
 * second and third properties.
 */
function selectBackgrounds(origin) {
    let backgrounds  = {first: "", second: "", third: ""};
    let allowUniques = true;

    return(generateBackground([origin], allowUniques, [])
            .then((background) => {
                allowUniques = !background.unique;
                backgrounds.first = background.key;
                return(generateBackground([origin], allowUniques, [backgrounds.first]));
            })
            .then((background) => {
                allowUniques = allowUniques && !background.unique;
                backgrounds.second = background.key;
                return(randomOrigin());
            })
            .then((newOrigin) => {
                return(generateBackground(getOriginKeys(), allowUniques, [backgrounds.first, backgrounds.second]));
            })
            .then((background) => {
                backgrounds.third = background.key;
                return(backgrounds)
            }));
}
