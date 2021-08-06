let modInfo = {
	name: "Tuba's Tree",
	id: "tubas-tree",
	author: "randomtuba",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "randomtuba's Discord Server",
	discordLink: "https://discord.gg/VxHzjtgdA4",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.4.1",
	name: "The Reincarnated Update",
}

let changelog = `<h2>Changelog</h2><br><br>
<b>v0.4.1</b><br>
-Fixed the unlock requirement for the 4th row of prestige upgrades.<br> 
-Fixed a bug with not gaining sacrificial gifts with 10% reincarnation charge from a rounding error.<br>
-Made hotkey text in the Info tab unlock based on the layers you have unlocked.<br>
-Fixed a bug with the 2nd prestige buyable not being able to be manually bought when its automation is enabled with Transcension Milestone 5 obtained.<br><br><br>
<b>v0.4: The Reincarnated Update</b><br>
-Added a new prestige layer, Reincarnation! 
-Added 5 new prestige upgrades and 5 new ascension upgrades.<br>
-Added 15 reincarnation upgrades to buy with quarks! You can also gain up to 7 reincarnation milestones.<br>
-Added 2 new challenges (Power Outage & Sadistic).<br>
-Added a 3rd ascension buyable (Ascension Point Booster).<br>
-Added 2 new rows of achievements!<br>
-Added Quark Energy! Do harder reincarnations with reincarnation charge to gain quark energy, which boosts all previous currencies!<br>
-Added Spirits! You can gain sacrificial gifts with reincarnation charge level 1 to buy 3 new buyables!<br>
-Added some linebreaks in the tab layout for the Transcension tab.<br><br><br>
<b>v0.3: The Bigger & Better Update</b><br>
-Added 5 new ascension upgrades and 5 new transcension upgrades.<br>
-Added 2 new challenges (No Shards II & Anti-Ascension).<br>
-Added a 2nd ascension buyable (Point Booster II).<br>
-Added a new row of achievements.<br>
-Added a new transcension milestone that requires 1e2000 transcension points! It gives automation for the 2nd ascension buyable and shard buyables.<br>
-Changed the description for the achievement "TRANSCENDED".<br>
-Created this changelog.<br><br><br>
<b>v0.2.1</b><br>
-Decreased some costs to make timewalls smaller.<br><br><br>
<b>v0.2: The Challenging Update</b><br>
-Added 5 new prestige upgrades and 4 new transcension upgrades.<br>
-Added 6 challenges! Complete them to gain bonuses and unlocks.<br>
-Added a 3rd prestige buyable (Ascension Point Doubler).<br>
-Added a new row of achievements.<br>
-Added a new transcension milestone that requires 1e45 transcension points! It gives automation for the ascension buyable and the 3rd prestige buyable.<br>
-Changed the color of the Goals tab to avoid confusion with the Ascension tab.<br>
-Renamed achievement "The Endgame" to "Point Galaxy".<br><br><br>
<b>v0.1.1</b><br>
-Changed the unlock system for upgrades and milestones.<br>
-Fixed the bug where the 5th transcension milestone was obtained with 8 total transcension points instead of 12 total transcension points.<br><br><br>
<b>v0.1: Base Game</b><br>
-Released the game.<br>
-Added 3 prestige layers: Prestige, Ascension, and Transcension.<br>
-Added 10 prestige upgrades, 10 ascension upgrades, and 6 transcension upgrades.<br>
-Added 2 prestige buyables, 1 ascension buyable, and 2 shard buyables.<br>
-Added 4 ascension milestones and 5 transcension milestones.<br>
-Added 15 achievements (although the achievements tab is called the Goals tab to not be confused with the Ascension tab).<br>
-Added Shards! Shards generate over time and boost your other currencies.<br><br><br>`

let winText = `Listen here you little shit, you weren't supposed to get here. You cheated and beat the game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
  gain = gain.mul(hasUpgrade("p",11)?5:1)
  gain = gain.mul(buyableEffect("p", 11))
  gain = gain.mul(hasUpgrade("p",14)?upgradeEffect("p", 14):1)
  gain = gain.mul(hasUpgrade("a",11)?10:1)
  gain = gain.mul(hasUpgrade("p",15)?1e10:1)
  gain = gain.mul(hasUpgrade("p",21)?upgradeEffect("p",21):1)
  gain = gain.mul(inChallenge("t",21) || inChallenge("t",41) || inChallenge("t",52) ? new Decimal(1) : player.t.shards.add(1).pow(new Decimal(0.5).mul(hasUpgrade("t",13)?3:1).mul(hasUpgrade("p",33)?2:1)).mul(hasChallenge("t",21)?1e8:1))
  gain = gain.mul(buyableEffect("a", 11))
  gain = gain.pow(inChallenge("t",12) || inChallenge("t",52)?0.75:1)
  gain = gain.pow(hasChallenge("t",12)?1.05:1)
  gain = gain.pow(inChallenge("t",32) || inChallenge("t",52)?0.01:1)
  gain = gain.mul(buyableEffect("a", 12))
  gain = gain.pow(inChallenge("t",41) || inChallenge("t",52)?0.1:1)
  gain = gain.mul(hasUpgrade("r",11)?1000:1)
  gain = gain.pow(hasUpgrade("r",12)?1.001:1)
  gain = gain.mul(inChallenge("t",51) || inChallenge("t",52) ? new Decimal(1) : player.r.quarkEnergy.add(1).pow(new Decimal(2.5).add(hasUpgrade("r",14)?player.r.total.log10().div(10):0)))
  gain = gain.pow(new Decimal(1).div(new Decimal(1.5).pow(player.r.charge.mul(10))))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1e22895400"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}