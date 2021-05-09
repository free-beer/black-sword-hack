import {BSHConfiguration} from './configuration.js';
import {calculateCharacterData, downgradeDie, getActorById, interpolate} from './shared.js';

/**
 * This function makes a doom role for a specified actor, downgrading the actors
 * doom die as appropriate and returning an object detailing the results of the
 * roll. The function accepts a second parameter to indicate whether the roll
 * should be made with "advantage", "disadvantage" or just a "standard" single
 * die roll (the default).
 */
export function rollDoom(actor, rollType="standard") {
    let result    = {die: {ending: null,
                           starting: null},
                     downgraded: false,
                     rolled: false};
    let actorData = actor.data.data;

    result.die.starting = result.die.ending = actorData.doom;
    if(actorData.doom !== "exhausted") {
        let data      = {data: {doom: actorData.doom}};
        let roll;

        console.log(`Rolling the doom die for ${actor.name}.`);
        result.die.starting = actorData.doom;
        result.rolled       = true;
        if(rollType === "advantage") {
            roll = new Roll(`2${actorData.doom}kh`);
        } else if(rollType === "disadvantage") {
            roll = new Roll(`2${actorData.doom}kl`);
        } else {
            roll = new Roll(`1${actorData.doom}`);
        }

        roll.roll();
        result.formula = roll.formula;
        result.result  = roll.total;
        if(roll.total < 3) {
            let newDie = downgradeDie(actorData.doom);

            console.log(`The doom die for ${actor.name} will be downgraded.`);
            result.downgraded = true;
            result.die.ending = newDie;
            data.data.doom    = newDie;
        } else {
            console.log(`The doom die for ${actor.name} will be unchanged.`);
            result.die.ending = actor.doom;
        }
        actor.update(data, {diff: true});
    } else {
        console.error(`Unable to roll doom for ${actor.name} as their doom die is exhausted.`);
        ui.notifications.error(interpolate("bsh.messages.doom.exhausted", {name: actor.name}));
    }
    return(result);
}

/**
 * Sets the actors Doom die to be exhausted and tweaks a few other elements
 * that are tied to Doom.
 */
export async function exhaustDoomDie(actor) {
    if(typeof actor === "string") {
        actor = getActorById(actor);
    }

    if(actor) {
        let updates = {data:      {doom: "exhausted",
                       summoning: {demon: "unavailable",
                                   spirit: "unavailable"}}};

        actor.update(updates, {diff: true});
    } else {
        console.error("Unable to find the specified actor to exhaust their Doom die.");
    }
}

/**
 * Resets a characters Doom Die to it's normal maximum level.
 */
export function resetDoomDie(actor) {
    if(typeof actor === "string") {
        actor = getActorById(actor);
    }

    if(actor) {
        let data    = actor.data.data;
        let updates = {data: {doom: "d6"}};

        calculateCharacterData(data, CONFIG.configuration);
        if(actor.level > 9) {
            updates.data.doom = "d8";
        }
        console.log(`Resetting the Doom Die for ${actor.name} to 1${updates.data.doom}.`);
        actor.update(updates, {diff: true});
    } else {
        console.error("Unable to find the specified actor to reset their Doom die.");
    }
}
