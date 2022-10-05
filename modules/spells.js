import {logSpellCast,
        logSpellCastFailure} from './chat_messages.js';
import {BSHConfiguration} from './configuration.js';
import {calculateAttributeValues,
        getOwnedItemById,
        interpolate,
        rollEm} from './shared.js';

/**
 * Retrieves a spell and attempts to cast it (if possible), reporting the
 * result to chat.
 */
export async function castSpell(spellId) {
    let spell = getOwnedItemById(spellId);

    if(spell && spell.type === "spell") {
        if(spell.system.state !== "unavailable") {
            let caster     = spell.actor;
            let dice       = null;
            let attributes = calculateAttributeValues(caster.system, BSHConfiguration);
            let message;
            let data       = {system: {state: "cast"}};

            if(spell.system.state === "available") {
                dice = new Roll("1d20");
            } else {
                dice = new Roll("2d20kh");
            }
            rollEm(dice).then((roll) => {
                if(roll.total >= attributes.intelligence) {
                    data.system.state = "unavailable";
                    logSpellCastFailure(spell, roll);
                } else {
                    logSpellCast(spell, roll);
                }
                spell.update(data, {diff: true});
            });
        } else {
            console.warn(`Unable to cast the ${spell.name} spell as it is not currently available for use.`);
        }
    } else {
        console.error(`Unable to locate a spell with the id ${spellId}.`);
        ui.notifications.error(game.i18n.localize("bsh.errors.spells.notFound"));
    }
}

/**
 * Resets a spell state.
 */
export async function resetSpellState(spellId) {
    let spell = getOwnedItemById(spellId);

    if(spell && spell.type === "spell") {
        spell.update({system: {state: "available"}}, {diff: true});
    } else {
        console.error(`Unable to locate a spell with the id ${spellId}.`);
        ui.notifications.error(game.i18n.localize("bsh.errors.spells.notFound"));
    }
}

export async function resetSpellStatesForActor(actorId) {
    let actor = game.actors.find((a) => a.id === actorId);

    if(actor) {
        actor.items.forEach((item) => {
            if(item.type === "spell") {
                resetSpellState(item.id);
            }
        });
    } else {
        console.error(`Unable to locate an actor with an id of ${actorId}.`);
        ui.notifications.error(game.i18n.localize("bsh.errors.actors.notFound"));
    }
}
