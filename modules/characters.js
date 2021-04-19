import {BSHConfiguration} from './configuration.js';

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

    console.log("Generating character attributes.");
    data.attributes.strength     = generateAttributeScore();
    data.attributes.dexterity    = generateAttributeScore();
    data.attributes.constitution = generateAttributeScore();
    data.attributes.intelligence = generateAttributeScore();
    data.attributes.wisdom       = generateAttributeScore();
    data.attributes.charisma     = generateAttributeScore();
    console.log("Base Attribute Scores:", data.attributes);

    console.log("Generating where the character was born.");
    data.birth = sampleFrom(BSHConfiguration.birthList);
    console.log("Birth Option:", data.birth);

    console.log("Generating character origin.");
    data.origin = sampleFrom(ORIGINS);
    console.log("Character Origin:", data.origin);

    data.backgrounds = selectBackgrounds(data.origin);

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

    console.log("Applying choices to the character record.");
    actor.update({data: data}, {diff: true});
}

/**
 * Generate an attribute score by rolling 2d6 and looking up the result in the
 * ROLL_TABLE.
 */
function generateAttributeScore() {
    let dice = new Roll("2d6");

    dice.roll();
    return(ROLL_TABLE[`${dice.total}`]);
}

/**
 * Random select an option from a list passed in.
 */
function sampleFrom(list) {
    let dice = new Roll(`1d${list.length}-1`);

    dice.roll();
    return(list[dice.total]);
}

function selectBackgrounds(origin) {
    let backgrounds    = {first: "", second: "", third: ""};
    let background     = null;
    let allBackgrounds = Object.values(BSHConfiguration.backgroundList);
    let options        = {barbarian: {},
                          civilized: {},
                          decadent:  {}};
    let otherOrigin    = null;
    let uniqueUsed     = false;

    for(const name in BSHConfiguration.backgroundList) {
        let entry = BSHConfiguration.backgroundList[name];
        options[entry.origin][name] = entry; 
    }

    console.log("Selecting first character background.");
    backgrounds.first = sampleFrom(Object.keys(options[origin]));
    background        = options[origin][backgrounds.first];
    uniqueUsed        = background.unique;
    console.log("First Background: ", background);

    console.log("Selecting second character background.");
    backgrounds.second = sampleFrom(Object.keys(options[origin]));
    background         = options[origin][backgrounds.second];
    while(background.unique && uniqueUsed) {
        background.second = sampleFrom(Object.keys(options[origin]));
        background        = options[origin][backgrounds.second];
    }
    uniqueUsed = uniqueUsed || background.unique;
    console.log("Second Background: ", background);

    console.log("Selecting origin for third background.");
    otherOrigin = sampleFrom(["barbarian", "civilized", "decadent"].filter((b) => b !== origin));
    console.log("Origin For Third Background:", otherOrigin);

    console.log("Selecting third character background.");
    backgrounds.third = sampleFrom(Object.keys(options[otherOrigin]));
    background        = options[otherOrigin][backgrounds.third];
    while(background.unique && uniqueUsed) {
        background.second = sampleFrom(Object.keys(options[otherOrigin]));
        background        = options[otherOrigin][backgrounds.third];
    }
    console.log("Third Background: ", background);

    return(backgrounds);
}
