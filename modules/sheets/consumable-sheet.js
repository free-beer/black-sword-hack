export default class ConsumableSheet  extends ItemSheet {
	get template() {
		return("systems/black-sword-hack/templates/sheets/consumable-sheet.html");
	}

	getData() {
		let data = super.getData();
		data.configuration = CONFIG.configuration;
		return(data);
	}
}