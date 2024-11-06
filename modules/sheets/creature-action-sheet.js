export default class CreatureActionSheet extends ItemSheet {
    static get defaultOptions() {
        return(foundry.utils.mergeObject(super.defaultOptions,
                                         {classes: ["bsh", "bsh-sheet", "bsh-creature-action"],
                                          height: 375,
                                          width: 750}));
    }

    get template() {
        return("systems/black-sword-hack/templates/sheets/creature-action-sheet.html");
    }

    getData() {
        let data = super.getData();

        data.configuration = CONFIG.configuration;
        return(data);
    }

    activateListeners(html) {
        // html.find('.bsh-attribute-selector').on("change", (e) => this._onAttributeSelectionChange(e, html));
        super.activateListeners(html);
    }

    _onAttributeSelectionChange(event, html) {
        let field = html[0].querySelector('input[name="system.attributes"]');
        let selected = html[0].querySelectorAll(".bsh-attribute-selector:checked");

        if(selected.length > 0) {
            let names = [];

            selected.forEach((checkbox) => names.push(checkbox.value));
            field.value = names.join(",");
        } else {
            field.value = "none";
        }
    }
}