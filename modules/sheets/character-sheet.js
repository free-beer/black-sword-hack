import {randomizeCharacter} from '../characters.js';
import {initializeCollapsibles} from '../collapsible.js';
import {logDefendRoll,
	    logDoomDieRoll,
	    logPerceptionRoll} from '../chat_messages.js';
import {resetDarkPact,
        summonDemon,
        summonSpirit} from '../darkpacts.js';
import {rollDoom} from '../doom.js';
import {calculateCharacterData,
	    decrementItemQuantity,
	    getActorById,
	    getOwnedItemById,
	    deleteOwnedItem,
	    handleRollAttributeDieEvent,
	    handleRollDieEvent,
	    handleRollUsageDieEvent,
	    handleWeaponRollEvent,
	    incrementItemQuantity,
	    resetItemUsageDie} from '../shared.js';
import {castSpell,
        resetSpellState,
        resetSpellStatesForActor} from '../spells.js';

export default class CharacterSheet extends ActorSheet {
	static get defaultOptions() {
	    return(mergeObject(super.defaultOptions,
	    	               {classes: ["bsh", "bsh-sheet", "bsh-character"],
	    	                height: 880,
	    	               	template: "systems/black-sword-hack/templates/sheets/character-sheet.html"}));
	}

	getData() {
		let data = super.getData();

		data.configuration = CONFIG.configuration;
		calculateCharacterData(data.data, CONFIG.configuration);
		data.consumables = data.items.filter((item) => item.type === "consumable");
		data.demons      = data.items.filter((item) => item.type === "demon");
		data.equipment   = data.items.filter((item) => item.type === "equipment");
		data.spells      = data.items.filter((item) => item.type === "spell");
		data.spirits     = data.items.filter((item) => item.type === "spirit");
		data.weapons     = data.items.filter((item) => item.type === "weapon");
		data.hasDemons   = (data.demons.length > 0);
		data.hasSpells   = (data.spells.length > 0);
		data.hasSpirits  = (data.spirits.length > 0);
		return(data);
	}

	activateListeners(html) {
		html.find(".bsh-tab-label").click(this._onTabLabelClicked.bind(this));
		html.find(".bsh-attribute-roll-icon").click(this._onAttributeRollClicked.bind(this));
		html.find(".bsh-dice-roll-icon").click(this._onDieRollClicked.bind(this));
		html.find(".bsh-usage-die-roll-icon").click(this._onUsageDieRollClicked.bind(this));
		html.find(".bsh-attack-roll-icon").click(this._onWeaponRollClicked.bind(this));
		html.find(".bsh-delete-item-icon").click(this._onDeleteItemClicked.bind(this));
		html.find(".bsh-decrease-quantity-icon").click(this._onDecreaseItemQuantityClicked.bind(this));
		html.find(".bsh-increase-quantity-icon").click(this._onIncreaseItemQuantityClicked.bind(this));
		html.find(".bsh-reset-usage-die-icon").click(this._onResetUsageDieClicked.bind(this));
		html.find(".bsh-item-name").click(this._onItemNameClicked.bind(this));
		html.find(".bsh-cast-spell-icon").click(this._onCastSpellClicked.bind(this));
		html.find(".bsh-reset-spell-state-icon").click(this._onResetSpellStateClicked.bind(this));
		html.find(".bsh-reset-all-spells-icon").click(this._onResetAllSpellStatesClicked.bind(this));
		html.find(".bsh-doom-roll-icon").click(this._onRollDoomDieClicked.bind(this));
		html.find(".bsh-reset-dark-pact-icon").click(this._onResetDarkPactClicked.bind(this));
		html.find(".bsh-summon-demon-icon").click(this._onSummonDemonClicked.bind(this));
		html.find(".bsh-summon-spirit-icon").click(this._onSummonSpiritClicked.bind(this));
		html.find(".bsh-random-character-generator-button").click(this._onRandomizeMyCharacterClicked.bind(this));
		html.find(".bsh-defend-roll-icon").click(logDefendRoll);
		html.find(".bsh-preception-roll-icon").click(logPerceptionRoll);
		initializeCollapsibles();
		super.activateListeners(html);
	}

	_onAttributeRollClicked(event) {
		handleRollAttributeDieEvent(event);
	}

	_onCastSpellClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.spell) {
			castSpell(element.dataset.spell);
		} else {
			console.error("Spell casting requested but requesting element does not have a spell attribute.");
		}
		return(false);
	}

	_onDecreaseItemQuantityClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.item) {
			decrementItemQuantity(element.dataset.item);
		} else {
			console.error("Decrease of item quantity requested but requesting element has no item attribute.");
		}
		return(false);
	}

	_onDeleteItemClicked(event) {
		let element = event.currentTarget;

		if(element.dataset.item) {
			deleteOwnedItem(element.dataset.item);
		} else {
			console.error("Delete item requested but requesting element has no item attribute.")
		}

		return(false);
	}

	_onRandomizeMyCharacterClicked(event) {
		let element = event.currentTarget;
		let actor   = game.actors.find((a) => a._id === element.dataset.id);

		event.preventDefault();
		if(actor) {
			randomizeCharacter(actor);
		}
	}

	_onResetDarkPactClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.actor && element.dataset.type) {
			resetDarkPact(element.dataset.actor, element.dataset.type);
		} else {
			console.error("Reset of dark pact requested but requesting element does not have an actor and/or type attribute.");
		}
		return(false);
	}

	_onResetSpellStateClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.spell) {
			resetSpellState(element.dataset.spell);
		} else {
			console.error("Spell state reset requested but requesting element does not have a spell attribute.");
		}
		return(false);
	}

	_onResetAllSpellStatesClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.actor) {
			resetSpellStatesForActor(element.dataset.actor);
		} else {
			console.error("Reset of all spell states requested but requesting element does not have an actor attribute.");
		}
		return(false);
	}

	_onSummonDemonClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.demon) {
			let rollType = "standard";

			if(event.shiftKey) {
				rollType = "advantage";
			} else if(event.ctrlKey) {
				rollType = "disadvantage";
			}
			summonDemon(element.dataset.demon, rollType);
		} else {
			console.error("Summoning of a demon was requested but requesting element does not have an actor attribute.");
		}
		return(false);
	}

	_onSummonSpiritClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.spirit) {
			let rollType = "standard";

			if(event.shiftKey) {
				rollType = "advantage";
			} else if(event.ctrlKey) {
				rollType = "disadvantage";
			}
			summonSpirit(element.dataset.spirit, rollType);
		} else {
			console.error("Summoning of a spirit was requested but requesting element does not have an actor attribute.");
		}
		return(false);
	}

	_onDieRollClicked(event) {
		handleRollDieEvent(event);
	}

	_onIncreaseItemQuantityClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.item) {
			incrementItemQuantity(element.dataset.item);
		} else {
			console.error("Increase of item quantity requested but requesting element has no item attribute.");
		}
		return(false);
	}

	_onItemNameClicked(event) {
		let element = event.currentTarget;
		event.preventDefault();
		if(element.dataset.item) {
		    let item = getOwnedItemById(element.dataset.item);
		    if(item && !item.sheet.rendered) {
		    	item.sheet.render(true);
		    }
		}
		return(false);
	}

	_onResetUsageDieClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.item) {
			resetItemUsageDie(element.dataset.item);
		} else {
			console.error("Reset of item usage die requested but requesting element has no item attribute.");
		}
		return(false);
	}

	_onRollDoomDieClicked(event) {
		let element = event.currentTarget;

		event.preventDefault();
		if(element.dataset.actor) {
			let actor = getActorById(element.dataset.actor);

			if(actor) {
				logDoomDieRoll(actor, event.shiftKey, event.ctrlKey)
			} else {
				console.error(`Unable to find an actor with the id '${element.dataset.actor}'.`);
			}
		} else {
			console.error("Roll of the doom die requested but requesting element has no actor id.");
		}

		return(false);
	}

	_onTabLabelClicked(event) {
		let element   = event.currentTarget;
		if(element.dataset.tab) {
			let actor     = null;
			let container = document.getElementsByClassName("bsh-cs-container")[0];
			let data      = {data: {tabSelected: element.dataset.tab}};

			event.preventDefault();

			if(!container) {
				throw("Failed to locate the character sheet container element.");
			}

	        actor = getActorById(container.dataset.actor);
	        if(!actor) {
	        	throw(`Failed to locate an actor with an id of ${container.data._id}.`);
	        }

	        data._id = actor._id;
			actor.update(data, {diff: true});
			this.selectTabLabel(element.dataset.tab);
			this.showTabBody(element.dataset.tab);
		}
		return(false);
	}

	_onUsageDieRollClicked(event) {
		return(handleRollUsageDieEvent(event));
	}

	_onWeaponRollClicked(event) {
		return(handleWeaponRollEvent(event));
	}

	selectTabLabel(tabName) {
		let tabLabels = document.getElementsByClassName("bsh-tab-label");
		for(let i = 0; i < tabLabels.length; i++) {
			if(tabLabels[i].dataset.tab === tabName) {
				tabLabels[i].classList.add("bsh-tab-selected");
			} else {
				tabLabels[i].classList.remove("bsh-tab-selected");
			}
		}

	}

	showTabBody(tabName) {
		let tabBodies = document.getElementsByClassName("bsh-tab-body");

        console.log(`Making the tab body for ${tabName} visible.`);
		for(let i = 0; i < tabBodies.length; i++) {
			tabBodies[i].classList.add("bsh-tab-hidden");
		}
		document.getElementsByClassName(`bsh-${tabName}-tab`)[0].classList.remove("bsh-tab-hidden");
	}
}
