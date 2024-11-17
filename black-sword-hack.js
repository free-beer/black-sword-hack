import {BSHActor} from './modules/documents/bsh_actor.js';
import BSHCombat from './modules/combat.js';
import {BSHConfiguration} from './modules/configuration.js';
import {CLASSIC_ORIGINS} from './modules/constants.js';
import {runMigrations} from './modules/migrations.js';
import {BSHItem} from './modules/documents/bsh_item.js';
import CharacterSheet from './modules/sheets/character-sheet.js';
import ConsumableSheet from './modules/sheets/consumable-sheet.js';
import CreatureActionSheet from './modules/sheets/creature-action-sheet.js';
import CreatureSheet from './modules/sheets/creature-sheet.js';
import EquipmentSheet from './modules/sheets/equipment-sheet.js';
import GiftSheet from './modules/sheets/gift-sheet.js';
import OriginSheet from './modules/sheets/origin-sheet.js';
import DemonSheet from './modules/sheets/demon-sheet.js';
import SpellSheet from './modules/sheets/spell-sheet.js';
import SpiritSheet from './modules/sheets/spirit-sheet.js';
import WeaponSheet from './modules/sheets/weapon-sheet.js';
import {logDamageRoll, toggleAttributeTestDisplay} from './modules/chat_messages.js';
import {getBackgrounds, getOrigins} from './modules/origins.js';
import {capitalize, stringToKey} from './modules/shared.js';

async function preloadHandlebarsTemplates() {
    const paths = ["systems/black-sword-hack/templates/messages/attack-roll.hbs",
                   "systems/black-sword-hack/templates/messages/damage.hbs",
                   "systems/black-sword-hack/templates/messages/damage-roll.hbs",
                   "systems/black-sword-hack/templates/messages/demon-failure.hbs",
                   "systems/black-sword-hack/templates/messages/demon-success.hbs",
                   "systems/black-sword-hack/templates/messages/die-roll.hbs",
                   "systems/black-sword-hack/templates/messages/doomed.hbs",
                   "systems/black-sword-hack/templates/messages/doom-roll.hbs",
                   "systems/black-sword-hack/templates/messages/roll.hbs",
                   "systems/black-sword-hack/templates/messages/spirit-failure.hbs",
                   "systems/black-sword-hack/templates/messages/spirit-success.hbs",
                   "systems/black-sword-hack/templates/messages/usage-die-roll.hbs",
                   "systems/black-sword-hack/templates/partials/cs-attribute-list.hbs",
                   "systems/black-sword-hack/templates/partials/cs-background-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-background-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-backgrounds-classic.hbs",
                   "systems/black-sword-hack/templates/partials/cs-base-attributes-list.hbs",
                   "systems/black-sword-hack/templates/partials/cs-consumable-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-demon-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-equipment-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-equipment-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-fp-background-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-front-page-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-gift-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-magic-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-saga-tab-body.hbs",
                   "systems/black-sword-hack/templates/partials/cs-spell-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-spirit-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-story-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cs-tab-bodies.hbs",
                   "systems/black-sword-hack/templates/partials/cs-tab-labels.hbs",
                   "systems/black-sword-hack/templates/partials/cs-weapon-entry.hbs",
                   "systems/black-sword-hack/templates/partials/cr-action-entry.hbs"];
    return(loadTemplates(paths))
}

Hooks.once("init", function() {
    console.log("Initializing the Black Sword Hack System.");

    CONFIG.Actor.documentClass  = BSHActor;
    CONFIG.Combat.documentClass = BSHCombat;
    CONFIG.configuration        = BSHConfiguration;
    CONFIG.Item.documentClass   = BSHItem;

    game.settings.register("black-sword-hack", "customOrigins", {config:  true,
                                                                 default: false,
                                                                 hint:    game.i18n.localize("bsh.settings.options.customOrigins.blurb"),
                                                                 name:    game.i18n.localize("bsh.settings.options.customOrigins.title"),
                                                                 scope:   "world",
                                                                 type:    Boolean});

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("black-sword-hack", ConsumableSheet, {types: ["consumable"]});
    Items.registerSheet("black-sword-hack", CreatureActionSheet, {types: ["creature_action"]});
    Items.registerSheet("black-sword-hack", DemonSheet, {types: ["demon"]});
    Items.registerSheet("black-sword-hack", EquipmentSheet, {types: ["equipment"]});
    Items.registerSheet("black-sword-hack", GiftSheet, {types: ["gift"]});
    Items.registerSheet("black-sword-hack", OriginSheet, {types: ["origin"]});
    Items.registerSheet("black-sword-hack", SpellSheet, {types: ["spell"]});
    Items.registerSheet("black-sword-hack", SpiritSheet, {types: ["spirit"]});
    Items.registerSheet("black-sword-hack", WeaponSheet, {types: ["weapon"]});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("black-sword-hack", CharacterSheet, {makeDefault: true, types: ["character"]});
    Actors.registerSheet("black-sword-hack", CreatureSheet, {makeDefault: true, types: ["creature"]});
    // Actors.registerSheet("bh2e", BH2eCreatureSheet, {makeDefault: true, types: ["creature"]});

    // Load templates.
    preloadHandlebarsTemplates();

    Handlebars.registerHelper("arrayIndexAdjuster", (index) => {
        return(`${index + 1}`);
    });

    Handlebars.registerHelper("backgroundSelect", function(offset, options) {
    	let backgrounds = {"": ""};
    	let labelKey    = `bsh.fields.labels.${offset}Background`;
    	let context     = {field:    `../data.backgrounds.${offset}`,
                           labelKey: labelKey,
                           options:  backgrounds};

        for(var key in BSHConfiguration.backgroundList) {
            if(options.hash.fromOrigin) {
            	if(BSHConfiguration.backgroundList[key].origin === this.actor.system.origin) {
            		backgrounds[key] = BSHConfiguration.backgroundList[key].name;
            	}
            } else {
                backgrounds[key] = BSHConfiguration.backgroundList[key].name;
            }
        }        

        return(options.fn(context));
    });

    Handlebars.registerHelper("capitalize", function(text) {
        return(`${text.substring(0, 1).toUpperCase()}${text.substring(1)}`);
    });

    Handlebars.registerHelper("checkboxStateSelector", (setting) => {
        return(setting ? "checked" : "");
    });

    Handlebars.registerHelper("backgroundColourClassChooser", (value) => {
        return(value % 2 === 0 ? "bsh-background-grey" : "bsh-background-white");
    });

    Handlebars.registerHelper("originBackgroundSelect", (originId, originField, selectedKey) => {
        let origin   = getOrigins(originId).find((o) => stringToKey(o.name) === originId);
        let template = "<div>NO BACKGROUND OPTIONS AVAILABLE.</div>";

        if(origin) {
            let backgrounds = (origin.system ? origin.system.backgrounds : origin.backgrounds);
            let options     =  [`<option value=""></option>`];
            options = options.concat(getBackgrounds(originId).map((background) => {
                let selected = (background.key === selectedKey ? 'selected="selected"' : "");
                let suffix   = [game.i18n.localize(`bsh.origins.${origin.id}.name`)];

                if(background.unique) {
                    suffix.push(game.i18n.localize("bsh.fields.labels.unique"));
                }

                return(`<option ${selected}value="${background.key}">${game.i18n.localize(background.localeKeys.label)} (${suffix.join(', ')})</option>`);
            }));

            return(`<select class="bsh-input bsh-select bsh-background-select" name="system.backgrounds.${originField}">${options.join("")}</select>`);
        } else {
            console.error(`Unable to locate an origin with the id '${originId}'.`);
        }

        return(template);
    });

    Handlebars.registerHelper("nonOriginBackgroundSelect", (originId, originField, selectedKey) => {
        let origins  = getOrigins();
        let template = "<div>NO BACKGROUND OPTIONS AVAILABLE.</div>";

        if(origins.length > 0) {
            let keys        = origins.map((o) => stringToKey(o.name));
            let backgrounds = getBackgrounds(...keys);
            let options     = ['<option value=""></option>'];

            backgrounds.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name)).map((background) => {
                let origin   = origins.find((o) => background.origin === o.id);
                let selected = (background.key === selectedKey ? 'selected="selected"' : '');
                let suffix   = [game.i18n.localize(`bsh.origins.${origin.id}.name`)];

                if(background.unique) {
                    suffix.push(game.i18n.localize("bsh.fields.labels.unique"));
                }
                options.push(`<option ${selected}value="${background.key}">${game.i18n.localize(background.localeKeys.label)} (${suffix.join(', ')})</option>`);
            });

            template = `<select class="bsh-input bsh-select" name="system.backgrounds.${originField}">${options.join("")}</select>`;
        } else {
            console.error(`Unable to locate an origin with the id '${originId}'.`);
        }

        return(template);
    });

    Handlebars.registerHelper("originSelect", (fieldName, selectedKey) => {
        let entries = getOrigins().map((origin) => {
            return({key: origin.key, id: origin.id, name: origin.name, selected: (stringToKey(origin.name) === selectedKey)});
        }).sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));
        let options = entries.map((entry) => {
            let selected = (entry.selected ? 'selected="selected"' : '');
            return(`<option ${selected} value="${stringToKey(entry.name)}">${game.i18n.localize(`bsh.origins.${entry.id}.name`)}</option>`);
        });

        return(`<select class="bsh-input bsh-select" name="${fieldName}">${options.join("")}</select>`);
    });

    Handlebars.registerHelper("spellStateClass", function(state) {
        return(state === "unavailable" ? "bsh-disabled" : "");
    });

    Handlebars.registerHelper("spellState", function(state) {
        return(game.i18n.localize(`bsh.spells.states.${state}`));
    });

    Handlebars.registerHelper("selectAttributeOption", function(chosen) {
        let selected = (chosen === this.key ? " selected" : " ");
        return(`<option${selected} value="${this.key}">${game.i18n.localize(this.value)}</option>`);
    });

    Handlebars.registerHelper("selectGiftOption", function(chosen) {
        let selected = (chosen === this.key ? " selected" : " ");
        return(`<option${selected} value="${this.key}">${game.i18n.localize(this.name)}</option>`);
    });

    Handlebars.registerHelper("summoningState", function(state) {
        return(game.i18n.localize(`bsh.summoning.states.${state}`));
    });

    Handlebars.registerHelper("tabLabelSelectionClass", function(name) {
        return(this.actor.system.tabSelected === name ? "bsh-tab-selected" : "");
    });

    Handlebars.registerHelper("tabBodySelectionClass", function(name) {
        return(this.actor.system.tabSelected === name ? "": "bsh-tab-hidden");
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
            let element = document.querySelector(`[data-message-id="${message.id}"]`);
            let node    = element.querySelector(".bsh-roll-title");

            if(node) {
                node.addEventListener("click", toggleAttributeTestDisplay);
            }

            node = element.querySelector(".bsh-damage-button");
            if(node) {
                node.addEventListener("click", logDamageRoll);
            }
        }, 250);
    });
});

Hooks.once("ready", function() {
    setTimeout(runMigrations, 500);
});
