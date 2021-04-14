import {BSHConfiguration} from './configuration.js';
import {calculateAttributeValues,
        generateDamageRollFormula,
        generateDieRollFormula,
        interpolate} from './shared.js';


export function logAttackRoll(actorId, weaponId, shiftKey=false, ctrlKey=false) {
    let actor  = game.actors.find((a) => a._id === actorId);

    if(actor) {
        let weapon = actor.items.find((i) => i._id === weaponId);

        if(weapon) {
            let attributes = calculateAttributeValues(actor.data.data, BSHConfiguration);
            let roll       = null;
            let attribute  = (weapon.data.data.type !== "ranged" ? "strength" : "dexterity");
            let critical   = {failure: false, success: false};
            let doomed     = (actor.data.data.doom === "exhausted");
            let data       = {actor:    actor.name, 
                              actorId:  actorId,
                              doomed:   doomed,
                              weapon:   weapon.name,
                              weaponId: weapon._id};

            if(shiftKey) {
                if(!doomed) {
                    roll = new Roll(generateDieRollFormula({kind: "advantage"}));
                } else {
                    roll = new Roll(generateDieRollFormula());
                }
            } else if(ctrlKey) {
                roll = new Roll(generateDieRollFormula({kind: "disadvantage"}));
            } else {
                if(!doomed) {
                    roll = new Roll(generateDieRollFormula());
                } else {
                    roll = new Roll(generateDieRollFormula({kind: "disadvantage"}));
                }
            }
            roll.roll();
            critical.failure = (roll.results[0] === 20);
            critical.success = (roll.results[0] === 1);
            data.roll        = {formula: roll.formula,
                                labels:  {title: interpolate("bsh.messages.titles.attackRoll")},
                                result:  roll.total,
                                tested:  true};

            data.roll.success = (!critical.failure && attributes[attribute] > data.roll.result);

            if(!critical.success && !critical.failure) {
                data.roll.labels.result = interpolate(data.roll.success ? "bsh.messages.labels.hit" : "bsh.messages.labels.miss");
            } else {
                if(critical.success) {
                    data.roll.labels.result = interpolate("bsh.messages.labels.criticalSuccess");
                } else {
                    data.roll.labels.result = interpolate("bsh.messages.labels.criticalFailure");
                }
            }

            if(data.roll.success) {
                data.damage = {actorId:  actor._id, 
                               critical: critical.success,
                               doomed:   doomed,
                               formula:  generateDamageRollFormula(actor, weapon, {critical: critical.success, doomed: doomed}),
                               weapon:   weapon.name,
                               weaponId: weapon._id};
            }

            showMessage(actor, "systems/black-sword-hack/templates/messages/attack-roll.hbs", data);
        } else {
            console.error(`Unable to locate weapon id '${weaponId}' on actor '${actor.name}'.`);
        }
    } else {
        console.error(`Unable to locate an actor with the id '${actorId}'.`);
    }
}

export function logAttributeTest(actor, attribute, shiftKey=false, ctrlKey=false) {
    let attributes = calculateAttributeValues(actor.data.data, BSHConfiguration);
    let critical   = {failure: false, success: true};
    let doomed     = (actor.data.data.doom === "exhausted");
    let message    = {actor:    actor.name, 
                      actorId:  actor._id,
                      roll:     {doomed:   doomed,
                                 expanded: true,
                                 formula:  (doomed ? "2d20kh" : "1d20"),
                                 labels:   {result: "", title: ""},
                                 result:   0,
                                 success:  false,
                                 tested:   true}};
    let roll       = null;
    let title      = game.i18n.localize(`bsh.fields.titles.dieRolls.attributes.${attribute}`)

    message.roll.labels.title = game.i18n.localize(`bsh.fields.titles.dieRolls.attributes.${attribute}`);

    if(shiftKey) {
        message.roll.formula = (doomed ? `1d20` : `2d20kl`);
    } else if(ctrlKey) {
        if(!doomed) {
            message.roll.formula = "2d20kh";
        }
    }
    roll = new Roll(message.roll.formula);
    roll.roll();
    critical.failure     = (roll.results[0] === 20);
    critical.success     = (roll.results[0] === 1);
    message.roll.result  = roll.total;
    message.roll.success = (critical.success || roll.total < attributes[attribute]);
    if(message.roll.success) {
        if(critical.failure) {
            message.roll.labels.result = game.i18n.localize("bsh.fields.titles.criticalSuccess");
        } else {
            message.roll.labels.result = game.i18n.localize("bsh.fields.titles.success");
        }
    } else {
        if(critical.failure) {
            message.roll.labels.result = game.i18n.localize("bsh.fields.titles.criticalFailure");
        } else {
            message.roll.labels.result = game.i18n.localize("bsh.fields.titles.failure");
        }
    }
    showMessage(actor, "systems/black-sword-hack/templates/messages/die-roll.hbs", message);
}

export function logDieRoll(actor, dieType, title, shiftKey=false, ctrlKey=false) {
    let doomed  = (actor.data.data.doom === "exhausted");
    let formula = (doomed ? `2${dieType}kl` : `1${dieType}`);
    let message = {actor:    actor.name, 
                   actorId:  actor._id,
                   doomed:   doomed,
                   roll:     {expanded: true,
                              formula:  formula,
                              labels:   {title: title},
                              result:   0,
                              tested:   false}};
    let roll    = null;

    if(shiftKey) {
        formula = (doomed ? `1${dieType}` : `2${dieType}kh`);
    } else if(ctrlKey) {
        if(!doomed) {
            formula = `2${dieType}kl`;
        }
    }
    roll = new Roll(formula);
    roll.roll();
    message.roll.result = roll.total;
    showMessage(actor, "systems/black-sword-hack/templates/messages/die-roll.hbs", message);
}

export function logDamageRoll(event) {
    let element  = event.currentTarget;
    let rollData = element.dataset;

    if(rollData.formula && rollData.actor) {
        let actor   = game.actors.find((a) => a._id === rollData.actor);
        let data    = {doomed: (rollData.doomed === "true"),
                       roll:   {expanded: true,
                                labels: {title: interpolate("bsh.messages.titles.damageRoll")},
                                tested: false}};
        let formula = rollData.formula;
        let roll    = null;

        data.roll.formula = formula;
        roll              = new Roll(formula)
        roll.roll();
        data.roll.result  = roll.total;

        showMessage(actor, "systems/black-sword-hack/templates/messages/damage-roll.hbs", data)
    } else {
        console.error("Damage roll requested but requesting element did not have a damage formula attribute.");
    }

    return(false);
}

export function showMessage(actor, templateKey, data) {
    getTemplate(templateKey)
        .then((template) => {
            let message = {speaker: ChatMessage.getSpeaker(actor=actor),
                           user:    game.user};

            console.log("Template Data:", data);
            message.content = template(data);
            ChatMessage.create(message);
        });
}

export function toggleAttributeTestDisplay(event) {
    let element = event.currentTarget;
    let parent  = element.parentElement;

    event.preventDefault();
    if(parent) {
        let details = parent.querySelector(".bsh-roll-details");

        if(details) {
            if(details.classList.contains("bsh-hidden")) {
                details.classList.remove("bsh-hidden");
            } else {
                details.classList.add("bsh-hidden");
            }
        }
    }
}

