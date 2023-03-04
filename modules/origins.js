import {CLASSIC_ORIGINS} from './constants.js';
import {stringToKey} from './shared.js';

function getBackgrounds(firstOriginKey, ...otherOriginKeys) {
    let backgrounds = [];
    let keys        = [firstOriginKey, ...otherOriginKeys];
    let origins     = getOrigins().filter((origin) => keys.includes(stringToKey(origin.name)));

    origins.forEach((origin) => {
        (origin.system ? origin.system.backgrounds : origin.backgrounds).forEach((entry) => {
            let background = JSON.parse(entry);

            background.origin = stringToKey(origin.name);
            backgrounds.push(background);
        });
    });

    backgrounds.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));

    return(backgrounds);
}

function getOriginKeys() {
    return(getOrigins().map((o) => stringToKey(o.name)));
}

function getOrigins() {
    let customOrigins = game.settings.get("black-sword-hack", "customOrigins");

    if(customOrigins) {
        return(game.items.filter((item) => item.type === "origin"));
    } else {
        return(Object.values(CLASSIC_ORIGINS));
    }
}

function getCustomOrigins() {
    return(game.items.filter((item) => item.type === "origin"));
}

export {
    getBackgrounds,
	getCustomOrigins,
    getOriginKeys,
    getOrigins
};
