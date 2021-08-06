addLayer("g", {
    name: "goals", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    color: "#FFAA00",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    tooltip:"Goals",
    resource: "goals", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
tabFormat: [
    "achievements"
],
    layerShown(){return true},
  achievements: {
    11: {
        name: "Prestigious",
      done(){return player.p.points.gte(1)},
      tooltip:"Prestige."
    }, 
    12: {
        name: "Nice",
      done(){return player.points.gte(6969)},
      tooltip:"Reach 6969 points."
    }, 
    13: {
        name: "Ooh, buyable!",
      done(){return hasUpgrade("p",12)},
      tooltip:"Unlock the 1st buyable."
    },
    14: {
        name: "Beyond",
      done(){return player.a.points.gte(1)},
      tooltip:"Ascend."
    },
    15: {
        name: "Nice^2",
      done(){return player.points.gte(48566961)},
      tooltip:"Reach 48,566,961 points."
    },
    21: {
        name: "Passive Generation",
      done(){return hasMilestone("a",2)},
      tooltip:"Begin to passively generate prestige points."
    }, 
    22: {
        name: "Inflation 101",
      done(){return hasUpgrade("a",21)},
      tooltip:"Unlock the 2nd buyable."
    }, 
    23: {
        name: "Super-Prestigious",
      done(){return player.p.upgrades.length>=8},
      tooltip:"Buy 8 prestige upgrades."
    },
    24: {
        name: "Far Beyond",
      done(){return player.t.points.gte(1)},
      tooltip:"Transcend."
    },
    25: {
        name: "Shard Bonanza",
      done(){return player.t.shards.gte(1000)},
      tooltip:"Reach 1000 shards."
    },
    31: {
        name: "TRANSCENDED",
      done(){return hasMilestone("t",4)},
      tooltip:"Obtain 5 Transcension Milestones."
    },
    32: {
        name: "True Divinity",
      done(){return player.a.points.gte(1e300)},
      tooltip:"Reach 1e300 ascension points."
    },
    33: {
        name: "Yet another new buyable",
      done(){return hasUpgrade("p",25)},
      tooltip:"Unlock the Shard Doubler."
    },
    34: {
        name: "Insane Gains",
      done(){return player.t.points.gte(2000)},
      tooltip:"Reach 2000 transcension points."
    },
    35: {
        name: "Point Galaxy",
      done(){return player.points.gte("1e900")},
      tooltip:"Reach 1e900 points."
    },
    41: {
        name: "The Next Era",
      done(){return hasUpgrade("t",23)},
      tooltip:"Unlock Challenges."
    },
    42: {
        name: "Point Singularity",
      done(){return player.points.gte("1e10000")},
      tooltip:"Reach 1e10,000 points."
    },
    43: {
        name: "Welcome To The Infinite",
      done(){return player.t.points.gte("1.797e308")},
      tooltip:"Reach 1.797e308 transcension points."
    },
    44: {
        name: "Extreme Gains",
      done(){return player.points.gte("1e100000")},
      tooltip:"Reach 1e100,000 points."
    },
    45: {
        name: "Engineer Gaming",
      done(){return hasUpgrade("t",25)},
      tooltip:"Buy 35 upgrades in total."
    },
    51: {
        name: "Shard Planet",
      done(){return player.t.shards.gte(1e200)},
      tooltip:"Reach 1e200 shards."
    },
    52: {
        name: "The Almighty",
      done(){return player.t.points.gte("1e1000")},
      tooltip:"Reach 1e1000 transcension points."
    },
    53: {
        name: "Point Universe",
      done(){return player.points.gte("1e200000")},
      tooltip:"Reach 1e200,000 points."
    },
    54: {
        name: "oh no",
      done(){return hasUpgrade("a",35)},
      tooltip:"Buy <b>Inflation II</b>."
    },
    55: {
        name: "Anti-Challenged",
      done(){return hasChallenge("t",42)},
      tooltip:"Complete 8 challenges."
    },
    61: {
        name: "Born Again",
      done(){return player.r.points.gte(1)},
      tooltip:"Reincarnate."
    },
    62: {
        name: "It's 2008 Once More",
      done(){return player.points.gte(1e200) && inChallenge("t",32)},
      tooltip:"Reach 1e200 points in Financial Recession."
    },
    63: {
        name: "Gotta Catch 'Em All",
      done(){return hasMilestone("r",5)},
      tooltip:"Obtain 6 Reincarnation Milestones."
    },
    64: {
        name: "Energized!",
      done(){return player.r.quarkEnergy.gte(1)},
      tooltip:"Begin to generate quark energy."
    },
    65: {
        name: "Inflation III when?",
      done(){return hasUpgrade("r",25)},
      tooltip:"Buy <b>Exceptional Exponents</b>."
    },
    71: {
        name: "Into The Heavens",
      done(){return hasUpgrade("r",31)},
      tooltip:"Unlock Spirits."
    },
    72: {
        name: "It's a Tuba's Tree Christmas",
      done(){return player.r.gifts.gte(1e6)},
      tooltip:"Reach 1,000,000 sacrificial gifts."
    },
    73: {
        name: "Biggest Numbers Yet",
      done(){return player.points.gte("1e1000000")},
      tooltip:"Reach e1,000,000 points."
    },
    74: {
        name: "To The Dark Side",
      done(){return player.r.charge.gte(0.99) && player.t.shards.gte("1e50")},
      tooltip:"Reach 1e50 shards with 100% reincarnation charge."
    },
    75: {
        name: "<span style='font-size: 12px; color: red;'><b>End of the World</b></span>",
      done(){return hasChallenge("t",52)},
      tooltip:"Complete Sadistic."
    },
},
})