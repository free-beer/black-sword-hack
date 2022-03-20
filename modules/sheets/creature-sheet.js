export default class CreatureSheet extends ActorSheet {
    static get defaultOptions() {
        return(mergeObject(super.defaultOptions,
                           {classes: ["bsh", "bsh-sheet", "bsh-character"],
                            height: 750,
                            template: "systems/black-sword-hack/templates/sheets/creature-sheet.html",
                            width: 700}));
    }

    /** @override */
    getData() {
        const context = super.getData();

        context.configuration = CONFIG.configuration;
        context.actions       = this._prepareActions(context); 

        return(context);
    }

    /** @override */
    get template() {
        return(`systems/black-sword-hack/templates/sheets/creature-sheet.html`);
    }

    activateListeners(html) {
        html.find('input[type="number"]').on("input", this._onNumericInputChanged.bind(this));
        html.find(".bsh-delete-action").click(this._onDeleteActionClicked.bind(this));
        html.find(".bsh-info-icon").click(this._onInfoIconClicked.bind(this));
        super.activateListeners(html);
    }

    _onDeleteActionClicked(event) {
        let actionId = event.currentTarget.dataset.id;

        if(actionId) {
            let data = super.getData();

            console.log(`Deleting action id '${actionId}'.`);
            data.actor.deleteEmbeddedDocuments("Item", [actionId], {render: true});
        } else {
            console.error("Delete action clicked but clicked icon has no action id data attribute.");
        }
    }

    _onInfoIconClicked(event) {
        let icon    = event.currentTarget;
        let content = icon.dataset.content.trim();

        if(content === "") {
            content = game.i18n.localize("bsh.creatures.actions.info.noDescription")
        }
        content = `<div class="bsh-action-description">${content}<div><br>`;
        Dialog.prompt({callback: () => {},
                       content:  content,
                       label:    game.i18n.localize("bsh.creatures.actions.info.dismiss"),
                       title:    game.i18n.localize("bsh.creatures.actions.info.title")}).render(true);
    }

    _onNumericInputChanged(event) {
        let field = event.currentTarget;

        if(!field.checkValidity()) {
            field.value = field.dataset.value;
        } else {
            field.dataset.value = field.value;
        }
    }

    _prepareActions(context) {
        let actions = [];

        context.items.forEach((item) => {
            if(item.type === "creature_action") {
                let attributes = [];

                Object.keys(item.data.attributes).forEach((attribute) => {
                    if(item.data.attributes[attribute]) {
                        attributes.push(attribute);
                    }
                });

                if(attributes.length > 0) {
                    let names = attributes.map((n) => game.i18n.localize(`bsh.attributes.${n}.short`));
                    item.testAttribute = names.join(" / ");
                } else {
                    item.testAttribute = game.i18n.localize("bsh.none");
                }
                actions.push(item);
            }
        });

        actions.sort((lhs, rhs) => {
            if(lhs.name < rhs.name) {
                return(-1);
            } else if(lhs.name > rhs.name) {
                return(1);
            } else {
                return(0);
            }
        });

        return(actions);
    }
}
