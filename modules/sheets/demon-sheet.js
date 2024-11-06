export default class DemonSheet  extends ItemSheet {
	static get defaultOptions() {
	    return(foundry.utils.mergeObject(super.defaultOptions,
	    	                             {classes: ["bsh", "bsh-sheet", "bsh-demon"],
	    	                              height: 350,
	    	               	              template: "systems/black-sword-hack/templates/sheets/demon-sheet.html",
	    	                              width: 700}));
	}

	get template() {
		return("systems/black-sword-hack/templates/sheets/demon-sheet.html");
	}

	getData() {
		let data = super.getData();
		data.configuration = CONFIG.configuration;
		return(data);
	}
}