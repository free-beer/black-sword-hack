import {logCallSpirit,
        logCallSpiritFailure,
        logDemonSummoning,
        logDemonSummoningFailure} from './chat_messages.js';
import {BSHConfiguration} from './configuration.js';
import {rollDoom} from './doom.js';
import {calculateAttributeValues,
        getActorById,
        getOwnedItemById,
        interpolate} from './shared.js';

/**
 * Reset one of the types dark pacts, either demons or spirits.
 */
export async function resetDarkPact(actorId, type) {
    let actor = getActorById(actorId);

    if(actor) {
        if(type === "demon") {
            actor.update({data: {summoning: {demon: "unused"}}}, {diff: true});
        } else if(type === "spirit") {
            actor.update({data: {summoning: {spirit: "unused"}}}, {diff: true});
        } else {
            console.error(`Unreognised dark pact type '${type}' specified.`);
        }
    } else {
        console.error(`Unable to locate an actor with the id ${actorId}.`);
        ui.notifications.error(game.i18n.localize("bsh.errors.actors.notFound"));
    }
}

/**
 * This function makes the doom roll related to summoning a demon.
 */
export async function summonDemon(demonId, rollType) {
    let demon = getOwnedItemById(demonId);

    if(demon && demon.type === "demon") {
        if(demon.actor.data.data.doom !== "exhausted") {
            if(demon.actor.data.data.summoning.demon !== "unused") {
                if(rollType === "advantage") {
                    console.log("Summoning roll downgrade from advantage to standard as demon already summoned.");
                    rollType = "standard";
                } else if(rollType === "standard") {
                    console.log("Summoning roll downgrade from standard to disadvantage as demon already summoned.");
                    rollType = "disadvantage";
                }
            }

            let result = rollDoom(demon.actor, rollType);

            demon.actor.update({data: {summoning: {demon: "used"}}}, {diff: true});
            result.doomed = (result.die.ending === "exhausted");
            if(result.downgraded) {
                logDemonSummoningFailure(demon, result);
            } else {
                logDemonSummoning(demon, result);
            }
        } else {
            console.error(`Unable to summon the '${demon.name}' demon as your Doom die is exhausted.`);
            ui.notifications.error(interpolate("bsh.messages.demons.unavailable", {name: demon.name}));
        }
    } else {
        console.error(`Unable to locate an owned demon with the id '${demonId}'.`);
        ui.notifications.error(game.i18n.localize("bsh.errors.items.owned.notFound"));
    }
}

/**
 * This function makes the doom roll related to summoning a spirit.
 */
export async function summonSpirit(spiritId, rollType) {
    let spirit = getOwnedItemById(spiritId);

    if(spirit && spirit.type === "spirit") {
        if(spirit.actor.data.data.doom !== "exhausted") {
            if(spirit.actor.data.data.summoning.spirit !== "unused") {
                if(rollType === "advantage") {
                    console.log("Summoning roll downgrade from advantage to standard as demon already summoned.");
                    rollType = "standard";
                } else if(rollType === "standard") {
                    console.log("Summoning roll downgrade from standard to disadvantage as demon already summoned.");
                    rollType = "disadvantage";
                }
            }

            let result = rollDoom(spirit.actor, rollType);

            spirit.actor.update({data: {summoning: {spirit: "used"}}}, {diff: true});
            result.doomed = (result.die.ending === "exhausted");
            if(result.downgraded) {
                logCallSpiritFailure(spirit, result);
            } else {
                logCallSpirit(spirit, result);
            }
        } else {
            console.error(`Unable to summon the '${spirit.name}' spirit as your Doom die is exhausted.`);
            ui.notifications.error(interpolate("bsh.messages.spirits.unavailable", {name: spirit.name}));
        }
    } else {
        console.error(`Unable to locate an owned spirit with the id '${spiritId}'.`);
        ui.notifications.error(game.i18n.localize("bsh.errors.items.owned.notFound"));
    }
}
