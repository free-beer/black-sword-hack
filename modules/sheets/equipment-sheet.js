export default class EquipmentSheet  extends ItemSheet {
	get template() {
		return("systems/black-sword-hack/templates/sheets/equipment-sheet.html");
	}

	getData() {
		let data = super.getData();
		data.configuration = CONFIG.configuration;
		return(data);
	}
}