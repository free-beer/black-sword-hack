import {resetDoomDie} from './doom.js';
import {calculateCharacterData, interpolate} from './shared.js';
import {resetSpellStatesForActor} from './spells.js';

/**
 * This function applies the benefits of a long rest to a character.
 */
export function takeLongRest(character) {
    let data    = character.system;
    let updates = {system: {}}

    calculateCharacterData(character, CONFIG.configuration);
    if(data.maximumHitPoints > data.currentHitPoints) {
        updates.system.currentHitPoints = data.maximumHitPoints;
    }

    if(data.summoning.demon !== "unused") {
        updates.system.summoning = {demon: "unused"};
    }

    if(data.summoning.spirit !== "unused") {
        if(!updates.system.summoning) {
            updates.system.summoning = {spirit: "unused"};
        } else {
            updates.system.summoning.spirit = "unused";
        }
    }

    resetSpellStatesForActor(character.id);
    resetDoomDie(character);

    if(Object.keys(updates.system).length > 0) {
        character.update(updates, {diff: true});
    }
    ui.notifications.notify(interpolate("bsh.messages.rests.longRest", {name: character.name}));
}

/**
 * This function applies the benefits of a long rest to a character.
 */
export function takeShortRest(character) {
    let data    = character.system;
    let updates = {system: {}};

    calculateCharacterData(character, CONFIG.configuration);
    if(data.maximumHitPoints > data.currentHitPoints) {
        updates.system.currentHitPoints = data.currentHitPoints + Math.floor(data.calculated.constitution / 2);
        if(updates.system.currentHitPoints > data.maximumHitPoints) {
            updates.system.currentHitPoints = data.maximumHitPoints;
        }
        character.update(updates, {diff: true});
    }

    if(Object.keys(updates.system).length > 0) {
        character.update(updates, {diff: true});
    }
    ui.notifications.notify(interpolate("bsh.messages.rests.shortRest", {name: character.name}));
}
