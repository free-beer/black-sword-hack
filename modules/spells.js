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
        if(spell.data.data.state !== "unavailable") {
            let caster     = spell.actor;
            let dice       = null;
            let attributes = calculateAttributeValues(caster.data.data, BSHConfiguration);
            let message;
            let data       = {data: {state: "cast"}};

            if(spell.data.data.state === "available") {
                dice = new Roll("1d20");
            } else {
                dice = new Roll("2d20kh");
            }
            rollEm(dice).then((roll) => {
                roll.toMessage({speaker: ChatMessage.getSpeaker(), user: game.user.id});

                if(roll.total < attributes.intelligence) {
                    message = interpolate("bsh.messages.spells.castSuccessful", {name: spell.name});
                } else {
                    data.data.state = "unavailable";
                    if(roll.total === 20) {
                        let tableName = game.i18n.localize("bsh.spells.tableName");
                        message = interpolate("bsh.messages.spells.castFumbled", {name: spell.name,
                                                                                  table: tableName});
                    } else {
                        message = interpolate("bsh.messages.spells.castFailed", {name: spell.name});
                    }
                }
                spell.update(data, {diff: true});
                ChatMessage.create({content: message,
                                    speaker: ChatMessage.getSpeaker(),
                                    user:    game.user.id});
            });
        } else {
            console.log(`Unable to cast the ${spell.name} spell as it is not currently available for use.`);
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
        spell.update({data: {state: "available"}}, {diff: true});
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
