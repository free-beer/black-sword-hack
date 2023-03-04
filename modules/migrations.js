import {CLASSIC_ORIGIN_MAP} from './constants.js';

/**
 * This migration upgrades character backgrounds from being a simple string to
 * one based on an origin id and background index.
 */
async function updateCharacterBackgrounds() {
	game.actors.forEach((actor) => {
		if(actor.type === "character") {
			let first  = `${actor.system.backgrounds.first}`.trim();
			let second = `${actor.system.backgrounds.second}`.trim();
			let third  = `${actor.system.backgrounds.third}`.trim();
			if(typeof actor.system.backgrounds.first === "string" ||
			   typeof actor.system.backgrounds.second === "string" ||
			   typeof actor.system.backgrounds.third === "string") {
				let updates = {system: {
					                  backgrounds: {first: first, second: second, third:  third}
					              }
					          };

                console.log(`Attempting background migration for '${actor.name}' (id: ${actor.id}).`);
                Object.values(actor.system.backgrounds).forEach((name) => {
                	if(`${name}`.trim() !== "" && !CLASSIC_ORIGIN_MAP[name]) {
                		console.error(`Unable to migrate the '${name}' background for character id '${actor.id}' (${actor.name}).`);
                		throw(`Unable to migrate unrecognised character background '${name}' for ${actor.name}.`);
                	}
                });

                if(first !== "" && typeof actor.system.backgrounds.first === "string") {
                	console.log(`Migrating '${actor.system.backgrounds.first}' to`, CLASSIC_ORIGIN_MAP[first]);
                	updates.system.backgrounds.first = CLASSIC_ORIGIN_MAP[first];
                }

                if(second !== "" && typeof actor.system.backgrounds.second === "string") {
                	console.log(`Migrating '${actor.system.backgrounds.second}' to`, CLASSIC_ORIGIN_MAP[second]);
                	updates.system.backgrounds.second = CLASSIC_ORIGIN_MAP[second];
                }

                if(third !== "" && typeof actor.system.backgrounds.third === "string") {
                	console.log(`Migrating '${actor.system.backgrounds.third}' to`, CLASSIC_ORIGIN_MAP[third]);
                	updates.system.backgrounds.third = CLASSIC_ORIGIN_MAP[third];
                }

                actor.update(updates, {diff: true});
			}
		}
	});
}

export {updateCharacterBackgrounds};
