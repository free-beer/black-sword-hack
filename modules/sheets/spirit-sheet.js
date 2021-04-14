export default class SpiritSheet  extends ItemSheet {
	get template() {
		return("systems/black-sword-hack/templates/sheets/spirit-sheet.html");
	}

	getData() {
		let data = super.getData();
		data.configuration = CONFIG.configuration;
		return(data);
	}
}