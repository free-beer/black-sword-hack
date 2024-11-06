export default class EquipmentSheet  extends ItemSheet {
    static get defaultOptions() {
        return(foundry.utils.mergeObject(super.defaultOptions,
                                         {classes:  ["bsh", "bsh-sheet", "bsh-equipment-sheet", "sheet"],
                                          height:   450,
                                          template: "systems/bsh/templates/sheets/equipment-sheet.html",
                                          width:    600}));
    }

	get template() {
		return("systems/black-sword-hack/templates/sheets/equipment-sheet.html");
	}

	getData() {
		let context = super.getData();

		context.configuration = CONFIG.configuration;
		return(context);
	}
}