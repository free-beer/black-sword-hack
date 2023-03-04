import BackgroundDialog from "../dialogs/background_dialog.js";

export default class OriginSheet extends ItemSheet {
	static get defaultOptions() {
	    return(mergeObject(super.defaultOptions,
	    	               {classes: ["bsh", "bsh-sheet", "bsh-origin"],
	    	                height: 600,
	    	               	template: "systems/black-sword-hack/templates/sheets/origin-sheet.html",
	    	                width: 700}));
	}

	get template() {
		return("systems/black-sword-hack/templates/sheets/origin-sheet.html");
	}

	getData() {
		let data = super.getData();
		data.configuration                 = CONFIG.configuration;
		data.data.system.backgroundObjects = data.data.system.backgrounds.map((definition) => JSON.parse(definition));
		return(data);
	}

	activateListeners(html) {
		html.find(".bsh-new-background-icon").click(this._onNewBackgroundClicked.bind(this));
		html.find(".bsh-background-row").click(this._onEditBackgroundClicked.bind(this));

		Array.from(html.find(".bsh-background-row")).forEach((row) => row.dataset.origin = this.object.id);
		super.activateListeners(html);
		if(!game.settings.get("black-sword-hack", "customOrigins")) {
		    ui.notifications.error(game.i18n.localize("bsh.errors.origins.custom.inactive"));
		}
	}

	_findRootElement(element) {
		let root = element;

		while(!root.classList.contains("bsh-origin-sheet-body")) {
			root = root.parentElement;
		}

		return(root);
	}

	_onEditBackgroundClicked(event) {
		let origin = this.object;
		let index  = parseInt(event.currentTarget.dataset.index);

		event.preventDefault();
		if(index < origin.system.backgrounds.length) {
			let background = JSON.parse(origin.system.backgrounds[index]);

			BackgroundDialog.buildForOrigin(event.currentTarget, background, {}).then((dialog) => dialog.render(true));
		} else {
			console.error(`Background index (${index}) out of range for origin id '${origin.id}'.`);
		}
	}

	_onNewBackgroundClicked(event) {
		event.preventDefault();
		BackgroundDialog.buildForNewOrigin(event.currentTarget, {}).then((dialog) => dialog.render(true));
	}
}