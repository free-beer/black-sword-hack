import {BSHConfiguration} from './modules/configuration.js';
import CharacterSheet from './modules/sheets/character-sheet.js';
import ConsumableSheet from './modules/sheets/consumable-sheet.js';
import EquipmentSheet from './modules/sheets/equipment-sheet.js';
import DemonSheet from './modules/sheets/demon-sheet.js';
import SpellSheet from './modules/sheets/spell-sheet.js';
import SpiritSheet from './modules/sheets/spirit-sheet.js';
import WeaponSheet from './modules/sheets/weapon-sheet.js';
import {logDamageRoll, toggleAttributeTestDisplay} from './modules/chat_messages.js';

async function preloadHandlebarsTemplates() {
    const paths = ["systems/black-sword-hack/templates/messages/attack-roll.hbs",
                   "systems/black-sword-hack/templates/messages/damage.hbs",
                   "systems/black-sword-hack/templates/messages/damage-roll.hbs",
                   "systems/black-sword-hack/templates/messages/die-roll.hbs",
                   "systems/black-sword-hack/templates/messages/doomed.hbs",
                   "systems/black-sword-hack/templates/messages/roll.hbs",
                   "systems/black-sword-hack/templates/partials/cs-attribute-list.hbs",
                   "systems/black-sword-hack/templates/partials/cs-background-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-base-attributes-list.hbs",
                   "systems/black-sword-hack/templates/partials/cs-consumable-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-demon-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-equipment-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-equipment-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-front-page-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-magic-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-saga-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-spell-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-spirit-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-tab-bodies.hbs",
                   "systems/black-sword-hack/templates/partials/cs-tab-labels.hbs",
                   "systems/black-sword-hack/templates/partials/cs-weapon-entry.hbs"];
    return(loadTemplates(paths))
}

Hooks.once("init", function() {
    console.log("Initializing the Black Sword Hack System.");

    CONFIG.configuration = BSHConfiguration;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("black-sword-hack", ConsumableSheet, {types: ["consumable"]});
    Items.registerSheet("black-sword-hack", DemonSheet, {types: ["demon"]});
    Items.registerSheet("black-sword-hack", EquipmentSheet, {types: ["equipment"]});
    Items.registerSheet("black-sword-hack", SpellSheet, {types: ["spell"]});
    Items.registerSheet("black-sword-hack", SpiritSheet, {types: ["spirit"]});
    Items.registerSheet("black-sword-hack", WeaponSheet, {types: ["weapon"]});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("black-sword-hack", CharacterSheet, {makeDefault: true, types: ["character"]});
    // Actors.registerSheet("bh2e", BH2eCreatureSheet, {makeDefault: true, types: ["creature"]});

    // Load templates.
    preloadHandlebarsTemplates();

    Handlebars.registerHelper("backgroundSelect", function(offset, options) {
    	let backgrounds = {"": ""};
    	let labelKey    = `bsh.fields.labels.${offset}Background`;
    	let context     = {field:    `../data.backgrounds.${offset}`,
                           labelKey: labelKey,
                           options:  backgrounds};

        for(var key in BSHConfiguration.backgroundList) {
            if(options.hash.fromOrigin) {
            	if(BSHConfiguration.backgroundList[key].origin === this.data.origin) {
            		backgrounds[key] = BSHConfiguration.backgroundList[key].name;
            	}
            } else {
                if(BSHConfiguration.backgroundList[key].origin !== this.data.origin) {
                    backgrounds[key] = BSHConfiguration.backgroundList[key].name;
                }
            }
        }        

        return(options.fn(context));
    });

    Handlebars.registerHelper("spellState", function(state) {
        return(game.i18n.localize(`bsh.spells.states.${state}`));
    });

    Handlebars.registerHelper("summoningState", function(state) {
        return(game.i18n.localize(`bsh.summoning.states.${state}`));
    });

    Handlebars.registerHelper("tabLabelSelectionClass", function(name) {
        return(this.data.tabSelected === name ? "bsh-tab-selected" : "");
    });

    Handlebars.registerHelper("tabBodySelectionClass", function(name) {
        return(this.data.tabSelected === name ? "": "bsh-tab-hidden");
    });

    Handlebars.registerHelper("usageDie", function(die) {
        let text = (die.current !== "" && die.current !== "^" ? die.current : die.maximum);

        if(text === "exhausted") {
            text = game.i18n.localize("bsh.dice.exhausted");
        }
        return(text);
    });

    Handlebars.registerHelper("weaponType", function(type) {
        if(type === "ranged") {
            return(game.i18n.localize("bsh.weapons.types.ranged"));
        } else if(type === "unarmed") {
            return(game.i18n.localize("bsh.weapons.types.unarmed"));
        } else {
            return(game.i18n.localize("bsh.weapons.types.melee"));
        };
    });

    // Add hook functions.
    Hooks.on("renderChatMessage", (message, speaker) => {
        setTimeout(() => {
            let element = document.querySelector(`[data-message-id="${message._id}"]`);
            let node    = element.querySelector(".bsh-roll-title");

            if(node) {
                node.addEventListener("click", toggleAttributeTestDisplay);
            }

            node = element.querySelector(".bsh-damage-button");
            if(node) {
                console.log()
                node.addEventListener("click", logDamageRoll);
            }
        }, 250);
    });

    // Handlebars.registerHelper("attackKind", function(key) {
    //     return(game.i18n.localize(`bh2e.weapons.kinds.${key}`));
    // });
    // Handlebars.registerHelper("longAttributeName", function(key) {
    //     return(game.i18n.localize(`bh2e.fields.labels.attributes.${key}.long`));
    // });
    // Handlebars.registerHelper("rangeName", function(name) {
    //     return(game.i18n.localize(`bh2e.ranges.${name}`));
    // });
    // Handlebars.registerHelper("shortAttributeName", function(key) {
    //     return(game.i18n.localize(`bh2e.fields.labels.attributes.${key}.short`));
    // });
});
