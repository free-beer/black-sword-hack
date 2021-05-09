import {resetDoomDie} from './doom.js';
import {calculateCharacterData, interpolate} from './shared.js';
import {resetSpellStatesForActor} from './spells.js';

/**
 * This function applies the benefits of a long rest to a character.
 */
export function takeLongRest(character) {
    let data    = character.data.data;
    let updates = {data: {}}

    console.log(`Applying the benefits of a long rest to ${character.name}.`);
    calculateCharacterData(data, CONFIG.configuration);
    if(data.maximumHitPoints > data.currentHitPoints) {
        console.log(`Restoring ${character.name} to maximum hit points.`);
        updates.data.currentHitPoints = data.maximumHitPoints;
    }

    if(data.summoning.demon !== "unused") {
        console.log("Resetting demon summoning for ${character.name}.");
        updates.data.summoning = {demon: "unused"};
    }

    if(data.summoning.spirit !== "unused") {
        console.log("Resetting spirit summoning for ${character.name}.");
        if(!updates.data.summoning) {
            updates.data.summoning = {spirit: "unused"};
        } else {
            updates.data.summoning.spirit = "unused";
        }
    }

    resetSpellStatesForActor(character._id);
    resetDoomDie(character);

    if(Object.keys(updates.data).length > 0) {
        character.update(updates, {diff: true});
    }
    ui.notifications.notify(interpolate("bsh.messages.rests.longRest", {name: character.name}));
}

/**
 * This function applies the benefits of a long rest to a character.
 */
export function takeShortRest(character) {
    let data    = character.data.data;
    let updates = {data: {}};

    console.log(`Applying the benefits of a short rest to ${character.name}.`);
    calculateCharacterData(data, CONFIG.configuration);
    if(data.maximumHitPoints > data.currentHitPoints) {
        console.log(`Character has lost hit points (${data.currentHitPoints} of ${data.maximumHitPoints}).`);
        updates.data.currentHitPoints = data.currentHitPoints + Math.floor(data.calculated.constitution / 2);
        if(updates.data.currentHitPoints > data.maximumHitPoints) {
            updates.data.currentHitPoints = data.maximumHitPoints;
        }
        character.update(updates, {diff: true});
    }

    if(Object.keys(updates.data).length > 0) {
        character.update(updates, {diff: true});
    }
    ui.notifications.notify(interpolate("bsh.messages.rests.shortRest", {name: character.name}));
}
