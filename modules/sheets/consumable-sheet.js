export default class ConsumableSheet  extends ItemSheet {
	static get defaultOptions() {
	    return(mergeObject(super.defaultOptions,
	    	               {classes: ["bsh", "bsh-sheet", "bsh-consumable"],
	    	                height: 450,
	    	               	template: "systems/black-sword-hack/templates/sheets/consumable-sheet.html",
	    	                width: 600}));
	}

	get template() {
		return("systems/black-sword-hack/templates/sheets/consumable-sheet.html");
	}

	getData() {
		let data = super.getData();
		data.configuration = CONFIG.configuration;
		return(data);
	}
}