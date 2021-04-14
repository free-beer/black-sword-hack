export default class DemonSheet  extends ItemSheet {
	get template() {
		return("systems/black-sword-hack/templates/sheets/demon-sheet.html");
	}

	getData() {
		let data = super.getData();
		data.configuration = CONFIG.configuration;
		return(data);
	}
}