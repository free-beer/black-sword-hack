export const BSHConfiguration = {};

BSHConfiguration.armourNames = {
	"none": "bsh.armour.none",
	"light": "bsh.armour.light",
	"medium": "bsh.armour.medium",
	"heavy": "bsh.armour.heavy"
};

BSHConfiguration.armourTypes = {
	"none": {
		"name": "bsh.armour.none",
	    "rating": 0
	},
	"light": {
		"name": "bsh.armour.light",
	    "rating": 1
	},
	"medium": {
		"name": "bsh.armour.medium",
	    "rating": 2
	},
	"heavy": {
		"name": "bsh.armour.heavy",
		"rating": 3
	}
};

BSHConfiguration.backgroundList = {
	"assassin": {
		"attributes": {
			"dexterity": 1
		},
		"key": "assassin",
		"origin": "decadent",
		"name": "bsh.backgrounds.assassin.name",
		"unique": true
	},
	"berserker": {
		"attributes": {
			"strength": 1
		},
		"key": "berserker",
		"origin": "barbarian",
		"name": "bsh.backgrounds.berserker.name",
		"unique": true
	},
	"bodyguard": {
		"attributes": {
			"constitution": 1
		},
		"key": "bodyguard",
		"origin": "civilized",
		"name": "bsh.backgrounds.bodyguard.name",
		"unique": false
	},
	"bookworm": {
		"attributes": {
			"intelligence": 1
		},
		"key": "bookworm",
		"origin": "civilized",
		"name": "bsh.backgrounds.bookworm.name",
		"unique": false
	},
	"changeling": {
		"attributes": {
			"charisma": 1
		},
		"key": "changeling",
		"origin": "decadent",
		"name": "bsh.backgrounds.changeling.name",
		"unique": true
	},
	"chieftain": {
		"attributes": {
			"strength": 1
		},
		"key": "chieftain",
		"origin": "barbarian",
		"name": "bsh.backgrounds.chieftain.name",
		"unique": false
	},
	"diplomat": {
		"attributes": {
			"charisma": 1
		},
		"key": "diplomat",
		"origin": "civilized",
		"name": "bsh.backgrounds.diplomat.name",
		"unique": false
	},
	"forbidden_knowledge": {
		"attributes": {
			"intelligence": 1
		},
		"key": "forbidden_knowledge",
		"origin": "decadent",
		"name": "bsh.backgrounds.forbidden_knowledge.name",
		"unique": false
	},
	"herbalist": {
		"attributes": {
			"intelligence": 1
		},
		"key": "herbalist",
		"origin": "barbarian",
		"name": "bsh.backgrounds.herbalist.name",
		"unique": false
	},
	"hunter": {
		"attributes": {
			"dexterity": 1
		},
		"key": "hunter",
		"origin": "barbarian",
		"name": "bsh.backgrounds.hunter.name",
		"unique": false
	},
	"inventor": {
		"attributes": {
			"intelligence": 1
		},
		"key": "inventor",
		"origin": "civilized",
		"name": "bsh.backgrounds.inventor.name",
		"unique": true
	},
	"legionnaire": {
		"attributes": {
			"strength": 1
		},
		"key": "legionnaire",
		"origin": "civilized",
		"name": "bsh.backgrounds.legionnaire.name",
		"unique": false
	},
	"pit-fighter": {
		"attributes": {
			"strength": 1
		},
		"key": "pit-fighter",
		"origin": "decadent",
		"name": "bsh.backgrounds.pit_fighter.name",
		"unique": false
	},
	"raider": {
		"attributes": {
			"strength": 1
		},
		"key": "raider",
		"origin": "barbarian",
		"name": "bsh.backgrounds.raider.name",
		"unique": false
	},
	"scout": {
		"attributes": {
			"wisdom": 1
		},
		"key": "scout",
		"origin": "barbarian",
		"name": "bsh.backgrounds.scout.name",
		"unique": false
	},
	"shaman": {
		"attributes": {
			"wisdom": 1
		},
		"key": "shaman",
		"origin": "barbarian",
		"name": "bsh.backgrounds.shaman.name",
		"unique": false
	},
	"snake_blood": {
		"attributes": {
			"constitution": 1
		},
		"key": "snake_blood",
		"origin": "decadent",
		"name": "bsh.backgrounds.snake_blood.name",
		"unique": false
	},
	"sophist": {
		"attributes": {
			"charisma": 1
		},
		"key": "sophist",
		"origin": "civilized",
		"name": "bsh.backgrounds.sophist.name",
		"unique": false
	},
	"storyteller": {
		"attributes": {
			"charisma": 1
		},
		"key": "storyteller",
		"origin": "barbarian",
		"name": "bsh.backgrounds.storyteller.name",
		"unique": false
	},
	"street_urchin": {
		"attributes": {
			"dexterity": 1
		},
		"key": "street_urchin",
		"origin": "civilized",
		"name": "bsh.backgrounds.street_urchin.name",
		"unique": false
	},
	"surgeon": {
		"attributes": {
			"intelligence": 1
		},
		"key": "surgeon",
		"origin": "civilized",
		"name": "bsh.backgrounds.surgeon.name",
		"unique": false
	},
	"survivor": {
		"attributes": {
			"constitution": 1
		},
		"key": "survivor",
		"origin": "barbarian",
		"name": "bsh.backgrounds.survivor.name",
		"unique": false
	},
	"swordmaster": {
		"attributes": {
			"dexterity": 1
		},
		"key": "swordmaster",
		"origin": "civilized",
		"name": "bsh.backgrounds.swordmaster.name",
		"unique": false
	},
	"vicious": {
		"attributes": {
			"strength": 1
		},
		"key": "vicious",
		"origin": "decadent",
		"name": "bsh.backgrounds.vicious.name",
		"unique": false
	},
	"warlock": {
		"attributes": {
			"charisma": 1
		},
		"key": "warlock",
		"origin": "decadent",
		"name": "bsh.backgrounds.warlock.name",
		"unique": false
	},
	"wildling": {
		"attributes": {
			"constitution": 1
		},
		"key": "wildling",
		"origin": "barbarian",
		"name": "bsh.backgrounds.wildling.name",
		"unique": false
	}
};

BSHConfiguration.birthList = {
	barbarian: ["bsh.births.barbarian.1",
		          "bsh.births.barbarian.2",
		          "bsh.births.barbarian.3",
		          "bsh.births.barbarian.4",
		          "bsh.births.barbarian.5",
		          "bsh.births.barbarian.6",
		          "bsh.births.barbarian.7",
		          "bsh.births.barbarian.8",
		          "bsh.births.barbarian.9",
		          "bsh.births.barbarian.10",
		          "bsh.births.barbarian.11",
		          "bsh.births.barbarian.12",
		          "bsh.births.barbarian.13",
		          "bsh.births.barbarian.14",
		          "bsh.births.barbarian.15",
		          "bsh.births.barbarian.16",
		          "bsh.births.barbarian.17",
		          "bsh.births.barbarian.18",
		          "bsh.births.barbarian.19",
		          "bsh.births.barbarian.20"],
	civilized: ["bsh.births.civilized.1",
		          "bsh.births.civilized.2",
		          "bsh.births.civilized.3",
		          "bsh.births.civilized.4",
		          "bsh.births.civilized.5",
		          "bsh.births.civilized.6",
		          "bsh.births.civilized.7",
		          "bsh.births.civilized.8",
		          "bsh.births.civilized.9",
		          "bsh.births.civilized.10",
		          "bsh.births.civilized.11",
		          "bsh.births.civilized.12",
		          "bsh.births.civilized.13",
		          "bsh.births.civilized.14",
		          "bsh.births.civilized.15",
		          "bsh.births.civilized.16",
		          "bsh.births.civilized.17",
		          "bsh.births.civilized.18",
		          "bsh.births.civilized.19",
		          "bsh.births.civilized.20"],
	decadent:  ["bsh.births.decadent.1",
		          "bsh.births.decadent.2",
		          "bsh.births.decadent.3",
		          "bsh.births.decadent.4",
		          "bsh.births.decadent.5",
		          "bsh.births.decadent.6",
		          "bsh.births.decadent.7",
		          "bsh.births.decadent.8",
		          "bsh.births.decadent.9",
		          "bsh.births.decadent.10",
		          "bsh.births.decadent.11",
		          "bsh.births.decadent.12",
		          "bsh.births.decadent.13",
		          "bsh.births.decadent.14",
		          "bsh.births.decadent.15",
		          "bsh.births.decadent.16",
		          "bsh.births.decadent.17",
		          "bsh.births.decadent.18",
		          "bsh.births.decadent.19",
		          "bsh.births.decadent.20"]
};

BSHConfiguration.classicBirthList = [
  "bsh.births.1",
  "bsh.births.2",
  "bsh.births.3",
  "bsh.births.4",
  "bsh.births.5",
  "bsh.births.6",
  "bsh.births.7",
  "bsh.births.8",
  "bsh.births.9",
  "bsh.births.10",
  "bsh.births.11",
  "bsh.births.12",
  "bsh.births.13",
  "bsh.births.14",
  "bsh.births.15",
  "bsh.births.16",
  "bsh.births.17",
  "bsh.births.18",
  "bsh.births.19",
  "bsh.births.20"
];

BSHConfiguration.diceList = {
	"d4": "bsh.dice.d4",
	"d6": "bsh.dice.d6",
	"d8": "bsh.dice.d8",
	"d10": "bsh.dice.d10",
	"d12": "bsh.dice.d12",
	"d20": "bsh.dice.d20"
};

BSHConfiguration.giftList = [
  {key: "none",
   name: "bsh.none"},
	{key:   "fortressOfTheMind",
	 label: "bsh.gifts.fortressOfTheMind.label",
	 name:  "bsh.gifts.fortressOfTheMind.name",
	 power: "balance"},
	{key:   "meditation",
	 label: "bsh.gifts.meditation.label",
	 name:  "bsh.gifts.meditation.name",
	 power: "balance"},
	{key:   "secondWind",
	 label: "bsh.gifts.secondWind.label",
	 name:  "bsh.gifts.secondWind.name",
	 power: "balance"},
	{key:   "spiritAlliance",
	 label: "bsh.gifts.spiritAlliance.label",
	 name:  "bsh.gifts.spiritAlliance.name",
	 power: "balance"},
	{key:   "survivorsLuck",
	 label: "bsh.gifts.survivorsLuck.label",
	 name:  "bsh.gifts.survivorsLuck.name",
	 power: "balance"},
	{key:   "armourOfScars",
	 label: "bsh.gifts.armorOfScars.label",
	 name:  "bsh.gifts.armorOfScars.name",
	 power: "chaos"},
	{key:   "bloodlust",
	 label: "bsh.gifts.bloodlust.label",
	 name:  "bsh.gifts.bloodlust.name",
	 power: "chaos"},
	{key:   "darkRevelation",
	 label: "bsh.gifts.darkRevelation.label",
	 name:  "bsh.gifts.darkRevelation.name",
	 power: "chaos"},
	{key:   "dubiousFriendships",
	 label: "bsh.gifts.dubiousFriendships.label",
	 name:  "bsh.gifts.dubiousFriendships.name",
	 power: "chaos"},
	{key:   "paranoid",
	 label: "bsh.gifts.paranoid.label",
	 name:  "bsh.gifts.paranoid.name",
	 power: "chaos"},
	{key:   "battleHardened",
	 label: "bsh.gifts.battleHardened.label",
	 name:  "bsh.gifts.battleHardened.name",
	 power: "law"},
	{key:   "resourceful",
	 label: "bsh.gifts.resourceful.label",
	 name:  "bsh.gifts.resourceful.name",
	 power: "law"},
	{key:   "riddleOfSteel",
	 label: "bsh.gifts.riddleOfSteel.label",
	 name:  "bsh.gifts.riddleOfSteel.name",
	 power: "law"},
	{key:   "toughAsNails",
	 label: "bsh.gifts.toughAsNails.label",
	 name:  "bsh.gifts.toughAsNails.name",
	 power: "law"},
	{key:   "willToLive",
	 label: "bsh.gifts.willToLive.label",
	 name:  "bsh.gifts.willToLive.name",
	 power: "law"}
];

BSHConfiguration.itemRarityList = {
	"common": "bsh.rarities.common",
	"rare": "bsh.rarities.rare",
	"exotic": "bsh.rarities.exotic",
	"unique": "bsh.rarities.unique"
};

BSHConfiguration.levelSettings = [
  {level: 1, stories: 0},
  {level: 2, stories: 1},
  {level: 3, stories: 3},
  {level: 4, stories: 7},
  {level: 5, stories: 11},
  {level: 6, stories: 16},
  {level: 7, stories: 22},
  {level: 8, stories: 29},
  {level: 9, stories: 37},
  {level: 10, stories: 46},
];

BSHConfiguration.languageList = {
	"alashan": {
		"origin": "A corrupt empire.",
		"name": "bsh.languages.alashan"
	},
	"amaric": {
		"origin": "The Caliphate.",
		"name": "bsh.languages.amaric"
	},
	"askavan": {
		"origin": "A crumbling empire.",
		"name": "bsh.languages.askavan"
	},
	"chalidim": {
		"origin": "The desert tribes.",
		"name": "bsh.languages.chaladim"
	},
	"duhuang": {
		"origin": "The Forbidden City & the Eastern Principalities",
		"name": "bsh.languages.duhuang"
	},
	"jurka": {
		"origin": "The Iron Horde.",
		"name": "bsh.languages.jurka"
	},
	"naruan": {
		"origin": "The Golden Archipelago.",
		"name": "bsh.languages.naruan"
	},
	"pictish": {
		"origin": "The Picts.",
		"name": "bsh.languages.pictish"
	},
	"thyrenian": {
		"origin": "The Merchant League.",
		"name": "bsh.languages.thyrenian"
	},
	"urgic": {
		"origin": "The northern raiders.",
		"name": "bsh.languages.urgic"
	}
};

BSHConfiguration.optionalAttributeList = {
	"charisma": "bsh.attributes.charisma.long",
	"constitution": "bsh.attributes.constitution.long",
	"dexterity": "bsh.attributes.dexterity.long",
	"intelligence": "bsh.attributes.intelligence.long",
	"none": "bsh.none",
	"strength": "bsh.attributes.strength.long",
	"wisdom": "bsh.attributes.wisdom.long"
};

BSHConfiguration.optionalAttributeListLong = [
    {"key": "charisma", "value": "bsh.attributes.charisma.long"},
    {"key": "constitution", "value": "bsh.attributes.constitution.long"},
    {"key": "dexterity", "value": "bsh.attributes.dexterity.long"},
    {"key": "intelligence", "value": "bsh.attributes.intelligence.long"},
    {"key": "none", "value": "bsh.none"},
    {"key": "strength", "value": "bsh.attributes.strength.long"},
    {"key": "wisdom", "value": "bsh.attributes.wisdom.long"}
];

BSHConfiguration.originList = {
	"barbarian": "bsh.origins.barbarian.name",
	"civilized": "bsh.origins.civilized.name",
	"decadent": "bsh.origins.decadent.name",
};

BSHConfiguration.powersList = {
	"balance": "bsh.powers.balance.name",
	"chaos": "bsh.powers.chaos.name",
	"law": "bsh.powers.law.name"
};

BSHConfiguration.rollTypes = {
	"advantage": "bsh.rolls.types.advantage",
	"disadvantage": "bsh.rolls.types.disadvantage",
	"standard": "bsh.rolls.types.standard"
};

BSHConfiguration.spellStates = {
	"available": "bsh.spells.states.available",
	"cast": "bsh.spells.states.cast",
	"unavailable": "bsh.spells.states.unavailable"
};

BSHConfiguration.summoningStates = {
	"unused": "bsh.summoning.states.unused",
	"used": "bsh.summoning.states.used"
};

BSHConfiguration.usageDieList = {
	"exhausted": "bsh.dice.exhausted",
	"d4": "bsh.dice.d4",
	"d6": "bsh.dice.d6",
	"d8": "bsh.dice.d8",
	"d10": "bsh.dice.d10",
	"d12": "bsh.dice.d12",
	"d20": "bsh.dice.d20"
};

BSHConfiguration.usageDieOptionList = {
	"d4": "bsh.dice.d4",
	"d6": "bsh.dice.d6",
	"d8": "bsh.dice.d8",
	"d10": "bsh.dice.d10",
	"d12": "bsh.dice.d12",
	"d20": "bsh.dice.d20"
};

BSHConfiguration.weaponHandsList = {
	"1": "bsh.weapons.hands.one",
	"2": "bsh.weapons.hands.two"
};

BSHConfiguration.weaponTypes = {
	"melee": "bsh.weapons.types.melee",
	"ranged": "bsh.weapons.types.ranged",
	"unarmed": "bsh.weapons.types.unarmed"
};

BSHConfiguration.yesNoList = {
	"yes": "bsh.yes",
	"no": "bsh.no"
};