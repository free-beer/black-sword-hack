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
            actor.update({system: {summoning: {demon: "unused"}}}, {diff: true});
        } else if(type === "spirit") {
            actor.update({system: {summoning: {spirit: "unused"}}}, {diff: true});
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
        if(demon.actor.system.doom !== "exhausted") {
            if(demon.actor.system.summoning.demon !== "unused") {
                if(rollType === "advantage") {
                    rollType = "standard";
                } else if(rollType === "standard") {
                    rollType = "disadvantage";
                }
            }

            rollDoom(demon.actor, rollType).then((result) => {
                demon.actor.update({system: {summoning: {demon: "used"}}}, {diff: true});
                result.doomed = (result.die.ending === "exhausted");
                if(result.downgraded) {
                    logDemonSummoningFailure(demon, result);
                } else {
                    logDemonSummoning(demon, result);
                }
            });
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
        if(spirit.actor.system.doom !== "exhausted") {
            if(spirit.actor.system.summoning.spirit !== "unused") {
                if(rollType === "advantage") {
                    rollType = "standard";
                } else if(rollType === "standard") {
                    rollType = "disadvantage";
                }
            }

            rollDoom(spirit.actor, rollType).then((result) => {
                spirit.actor.update({system: {summoning: {spirit: "used"}}}, {diff: true});
                result.doomed = (result.die.ending === "exhausted");
                if(result.downgraded) {
                    logCallSpiritFailure(spirit, result);
                } else {
                    logCallSpirit(spirit, result);
                }
            });
        } else {
            console.error(`Unable to summon the '${spirit.name}' spirit as your Doom die is exhausted.`);
            ui.notifications.error(interpolate("bsh.messages.spirits.unavailable", {name: spirit.name}));
        }
    } else {
        console.error(`Unable to locate an owned spirit with the id '${spiritId}'.`);
        ui.notifications.error(game.i18n.localize("bsh.errors.items.owned.notFound"));
    }
}
