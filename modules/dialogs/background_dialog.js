import {stringToKey} from '../shared.js';

const STARTING_OBJECT = {description: "",
                         index:       -1,
                         key:         "",
                         name:        "",
                         stats:      {charisma:     "+0",
                                      constitution: "+0",
                                      dexterity:    "+0",
                                      intelligence: "+0",
                                      strength:     "+0",
                                      wisdom:       "+0"},
                         unique:     false};


export default class BackgroundDialog extends FormApplication {
    static get defaultOptions() {
        return(foundry.utils.mergeObject(super.defaultOptions,
                                         {closeOnSubmit: false,
                                          height:        550,
                                          template:      "systems/black-sword-hack/templates/dialogs/background.html",
                                          title:         "Background",
                                          width:         575}));
    }

	constructor(settings) {
        let buttons = {save: {callback: () => this._saveBackground(),
                              label: game.i18n.localize("bsh.buttons.save")}};

        super(Object.assign(foundry.utils.mergeObject({},
                                                      (settings.data.background || STARTING_OBJECT)),
                                                      settings,
                                                      {buttons: buttons}));
        this._newOrigin = (settings.newOrigin === true);
        this._originId  = settings.originId;
	}

    get background() {
        let object = this.object;

        return({description: object.description,
                index:       parseInt(object.index),
                key:         object.key,
                name:        object.name,
                stats:       mergeObject({}, object.stats),
                unique:      object.unique});
    }

    get isNewOrigin() {
        return(this._newOrigin);
    }

    get origin() {
        let origin = game.items.find((a) => a.id === this._originId);

        if(!origin) {
            throw(`Unable to locate an origin with the id '${this._originId}'.`);
        }

        return(origin);
    }

    get originId() {
        return(this._originId);
    }


    getData(options = {}) {
        return super.getData();
    }

    activateListeners(html) {
        let keyField   = html.find('input[name="key"]')[0];
        let nameField  = html.find('input[name="name"]')[0];
        let saveButton = html.find(".save-button");

        html.find(".close-button").click(this._onCloseClicked.bind(this));
        saveButton.click(this._onSaveClicked.bind(this));

        nameField.addEventListener("input", this._onNameChanged.bind(this));
        saveButton[0].disabled = (nameField.value.trim() === "");

        if(this.isNewOrigin) {
            nameField.addEventListener("input", (event) => {
                this._updateKey(event, nameField, keyField);
            });
        }

        if(keyField.value.trim() === "") {
            this.object.key = keyField.value = stringToKey(nameField.value);
        }

        super.activateListeners(html);
    }

    async _updateObject(event, formData) {
        this.object.index              = formData.index;
        this.object.key                = formData.key;
        this.object.name               = formData.name;
        this.object.stats.charisma     = formData.charisma;
        this.object.stats.constitution = formData.constitution;
        this.object.stats.dexterity    = formData.dexterity;
        this.object.stats.intelligence = formData.intelligence;
        this.object.stats.strength     = formData.strength;
        this.object.stats.wisdom       = formData.wisdom;
        this.object.unique             = formData.unique;
        if(formData.description) {
            this.object.description = formData.description;
        }
        return;
    }

    _onCloseClicked(event) {
        event.preventDefault();
        this.close();
    }

    _onNameChanged(event) {
        let button = this.form.querySelector('.save-button');
        let field  = this.form.querySelector('input[name="name"]')

        button.disabled = (field.value.trim() === "");
    }

    _onSaveClicked(event) {
        event.preventDefault();
        this.submit().then(() => {
            this._saveBackground();
            this.close();
        });
    }


    _saveBackground() {
        let origin     = this.origin;
        let background = this.background;
        let updates    = {system: {backgrounds: []}};

        updates.system.backgrounds = origin.system.backgrounds.map((e) => e);
        if(background.index === -1) {
            background.index = updates.system.backgrounds.length;
            updates.system.backgrounds.push(JSON.stringify(background));
        } else {
            updates.system.backgrounds[background.index] = JSON.stringify(background);
        }

        if(updates.system.backgrounds.length > 0) {
            origin.update(updates, {diff: true});
        }
    }

    _updateKey(event, nameField, keyField) {
        keyField.value = `${this.originId}-${stringToKey(nameField.value)}`;
    }

    static buildForOrigin(element, background, options) {
        let origin = game.items.find((a) => a.id === element.dataset.origin);

        if(origin) {
            let settings = Object.assign({}, options);
            let data     = {background:  background,
                            description: options.description,
                            originId:    origin.id};

            settings.data      = data;
            settings.newOrigin = false;
            settings.originId  = origin.id;
            settings.title     = game.i18n.localize(`bsh.dialogs.titles.background`);
            return(renderTemplate("systems/black-sword-hack/templates/dialogs/background.html", data)
                       .then((content) => {
                                 settings.content = content;
                                 return(new BackgroundDialog(settings));
                             }));   
        } else {
            console.error(`Unable to locate origin id '${element.dataset.origin}'.`);
        }
    }

    static buildForNewOrigin(element, options) {
        let origin = game.items.find((a) => a.id === element.dataset.origin);

        if(origin) {
            let settings = Object.assign({}, options);
            let data     = {description: options.description,
                            originId: origin.id};

            settings.data      = data;
            settings.newOrigin = true;
            settings.originId  = origin.id;
            settings.title     = game.i18n.localize(`bsh.dialogs.titles.background`);
            return(renderTemplate("systems/black-sword-hack/templates/dialogs/background.html", data)
                       .then((content) => {
                                 settings.content = content;
                                 return(new BackgroundDialog(settings));
                             }));   
        } else {
            console.error(`Unable to locate origin id '${element.dataset.origin}'.`);
        }
    }
}
