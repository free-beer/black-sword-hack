import {logAttributeTest} from './chat_messages.js';
import {calculateCharacterData, rollEm} from './shared.js';

export default class AttributeTestDialog extends Dialog {
    constructor(actor, attribute, settings, options={}) {
        let buttons = {rollIt: {callback: () => this._onRollIt(),
                                label: game.i18n.localize("bsh.buttons.rollIt")}};

        super(Object.assign({}, settings, {buttons: buttons}));
        this._actor     = actor;
        this._attribute = attribute;
        this._options   = options;
        this._settings  = settings;
    }

    activateListeners(html) {
        html.find('input[name="threat"]').on("change", this._onThreatChanged.bind(this));
        super.activateListeners(html);
    }

    get actor() {
        return(this._actor);
    }

    get adjustment() {
        let value = this.element[0].querySelector('input[name="adjustment"]').value.trim();

        if(value !== "") {
            return(parseInt(value));
        } else {
            return(0);
        }
    }

    get attribute() {
        return(this._attribute);
    }

    get isWithAdvantage() {
        return(this.rollType === "advantage");
    }

    get isWithDisadvantage() {
        return(this.rollType === "disadvantage");
    }

    get rollType() {
        return(this.element[0].querySelector('select[name="type"]').value);
    }

    get threat() {
        let value = this.element[0].querySelector('input[name="threat"]').value.trim();

        if(value !== "") {
            value = parseInt(value);
            return(value < 0 ? 0 : value);
        } else {
            return(0);
        }
    }

    get totalAdjustment() {
        return(this.threat + this.adjustment);
    }

    _onBonusPenaltyChanged(event) {
        if(event.currentTarget.value.trim() === "") {
            event.currentTarget.value = 0;
        }

    }

    _onRollIt() {
        logAttributeTest(this._actor,
                         this._attribute,
                         this.isWithAdvantage,
                         this.isWithDisadvantage,
                         false,
                         this.totalAdjustment);
    }

    _onThreatChanged(event) {
        if(event.currentTarget.value.trim() !== "") {
            let value = parseInt(event.currentTarget.value);

            if(value < 0) {
                event.currentTarget.value = 0;
            }
        } else {
            event.currentTarget.value = 0;
        }
    }

    static build(actor, attribute, options={}) {
        let settings = Object.assign({}, options);
        let data     = {adjustment:    (settings.adjustment || 0),
                        attribute:     game.i18n.localize(`bsh.attributes.${attribute}.long`),
                        configuration: CONFIG.configuration,
                        score:         0,
                        threat:        (settings.threat || 0),
                        type:          (settings.rollType || "standard")};

        calculateCharacterData(actor, CONFIG.configuration);
        data.score     = (actor.system.calculated || actor.system.calculated)[attribute];
        settings.title = game.i18n.localize(`bsh.rolls.tests.${attribute}.title`);

        return(renderTemplate("systems/black-sword-hack/templates/roll-modal.html", data)
                   .then((content) => {
                             settings.content = content;
                             return(new AttributeTestDialog(actor, attribute, settings, options));
                         }));   
    }
}
