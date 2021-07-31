addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    passiveGeneration(){
      return hasMilestone("a", 2) ? 1 : 0
    },
    color: "#006666",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(hasUpgrade("p",13)?3:1)
        mult = mult.mul(hasUpgrade("a",12)?upgradeEffect("a", 12):1)
        mult = mult.mul(buyableEffect("p",12))
        mult = mult.pow(hasUpgrade("p",22)?1.1:1)
        mult = mult.mul(player.t.shards.add(1).pow(hasUpgrade("t",13)?1.5:0.5))
        mult = mult.mul(hasUpgrade("t",11)?1e6:1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate(){
      if (player.p.auto) {
        hasMilestone("t",4) ? addBuyables("p",11,player.p.points.dividedBy(10).times(9).dividedBy(getBuyableAmount("p",11).plus(1).pow10()).plus(1).log(100).floor()) : buyBuyable("p",11)
      }
      if (player.p.auto2) {
        hasMilestone("t",4) ? addBuyables("p",12,player.p.points.dividedBy(1e10).times(99).dividedBy(new Decimal(100).pow(getBuyableAmount("p",12).plus(1))).plus(1).log10().floor()) : buyBuyable("p",12)
      }
    },
    layerShown(){return true},
    doReset(layer){
      if(layer=="p")return
        let keep = []
      if (layer=="a") {
        if (hasMilestone("a", 0)) keep.push("upgrades")
      }
      if (layer=="t"){
        if (!hasMilestone("t", 1)) player.p.auto = false;
        if (!hasMilestone("t", 1)) player.p.auto2 = false;
        if (hasMilestone("t", 0)) keep.push("upgrades")
      }
      layerDataReset("p",keep)
    },
    upgrades: {
      11: {
        title: "Point Multiplier",
        description: "Multiply point gain by 5.",
        cost: new Decimal(1),
      },
      12: {
        title: "Buyable Unlock",
        description: "Unlock a buyable.",
        cost: new Decimal(10),
        unlocked(){return hasUpgrade("p",11) || hasUpgrade("p",12) || player.a.total.gte(1) || player.t.total.gte(1)}
      },
      13: {
        title: "Prestige Enhancement",
        description: "Triple prestige point gain.",
        cost: new Decimal(25),
        unlocked(){return hasUpgrade("p",11) || hasUpgrade("p",13) || player.a.total.gte(1) || player.t.total.gte(1)}
      },
      14: {
        title: "Prestige Bonus",
        description: "Gain more points based on total prestige points.",
        cost: new Decimal(200),
        unlocked(){return hasUpgrade("p",13) || hasUpgrade("p",14) || player.a.total.gte(1) || player.t.total.gte(1)},
        effect(){return player.p.total.pow(hasUpgrade("a",14)?0.75:0.5).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      15: {
        title: "Short & Simple",
        description: "Multiply point gain by 1e10.",
        cost: new Decimal(1e220),
        unlocked(){return hasUpgrade("a",22) || hasUpgrade("p",15)}
      },
      21: {
        title: "Self-Synergy",
        description: "Gain more points based on points.",
        cost: new Decimal(1e275),
        unlocked(){return hasUpgrade("a",22) || hasUpgrade("p",21)},
        effect(){return player.points.pow(0.05).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      22: {
        title: "Prestige Exponential",
        description: "Prestige points ^1.1.",
        cost: new Decimal("1e420"),
        unlocked(){return hasUpgrade("a",22) || hasUpgrade("p",22)},
      },
      23: {
        title: "Hardcap Repellent",
        description: "Remove the hardcap for <b>Ascension Bonus</b>, but the formula for that upgrade is (softcapped).",
        cost: new Decimal("1e465"),
        unlocked(){return hasUpgrade("a",22) || hasUpgrade("p",23)},
      },
      24: {
        title: "Transcendental Tripler",
        description: "Gain 3x more transcension points.",
        cost: new Decimal("1e610"),
        unlocked(){return hasUpgrade("t",15) || hasUpgrade("p",24)},
      },
      25: {
        title: "New Shard Buyable",
        description: "Unlock a new buyable for shards.",
        cost: new Decimal("6.666e666"),
        unlocked(){return hasUpgrade("t",15) || hasUpgrade("p",25)},
      },
    },
    buyables: {
    11: {
        title: "Point Quadrupler",
        cost(x) { return new Decimal(10).mul(new Decimal(10).pow(x)) },
        display() {return `Quadruple point gain every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x points`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasUpgrade("p",12)},
        effect(x) {
          mult2 = new Decimal(x).gte(15)? new Decimal(4).pow(15).mul(new Decimal(2.5).pow(new Decimal(x).sub(15))):new Decimal(4).pow(x)
          return mult2
        },
    },
    12: {
        title: "Prestige Point Tripler",
        cost(x) { return new Decimal(1e10).mul(new Decimal(100).pow(x)) },
        display() {return `Triple prestige point gain every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x prestige points`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasUpgrade("a",21)},
        effect(x) {
          mult2 = new Decimal(x).gte(45)? new Decimal(3).pow(45).mul(new Decimal(1.25).pow(new Decimal(x).sub(45))):new Decimal(3).pow(x)
          return mult2
        },
    },
}
})
addLayer("a", {
    name: "ascension", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    passiveGeneration(){
      return hasMilestone("t", 3) ? 1 : 0
    },
    color: "#FFFF00",
    requires: new Decimal(10000), // Can be a function that takes requirement increases into account
    resource: "ascension points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(hasUpgrade("a",13)?upgradeEffect("a", 13):1)
        mult = mult.mul(hasUpgrade("a",23)?1000:1)
        mult = mult.mul(hasUpgrade("t",12)?upgradeEffect("t",12):1)
        mult = mult.mul(hasUpgrade("t",14)?player.t.shards.add(1).pow(hasUpgrade("t",13)?1.5:0.5):1)
        mult = mult.mul(hasUpgrade("t",21)?1e15:1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for ascension points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["p"],
    layerShown(){return player.p.total.gte(1000) || player.a.total.gte(1) || player.t.total.gte(1)},
    doReset(layer){
      if (layer=="p")return
        let keep = []
      if (layer=="a")return
        let keep2 = []
      if (layer=="t"){
        if (hasMilestone("t", 1)) keep.push("milestones")
        if (hasMilestone("t", 2)) keep.push("upgrades")
      }
      layerDataReset("a",keep)
    },
    upgrades: {
      11: {
        title: "Divine Power",
        description: "Multiply point gain by 10.",
        cost: new Decimal(1),
      },
      12: {
        title: "Ascension Bonus",
        description: "Gain more prestige points based on total ascension points.",
        cost: new Decimal(2),
        unlocked(){return hasUpgrade("a",11) || hasUpgrade("a",12) || player.t.total.gte(1)},
        effect(){return player.a.total.pow(hasUpgrade("a",15)?0.6:0.5).add(1).gte(1e120) ? (hasUpgrade("p",23) ? new Decimal(1e200).pow(hasUpgrade("a",15)?0.6:0.5).add(1).mul(player.a.total.pow(0.1).add(1)) : new Decimal(1e120)) : player.a.total.pow(hasUpgrade("a",15)?0.6:0.5).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      13: {
        title: "Ascended Points",
        description: "Gain more ascension points based on points. (hardcaps at 25x)",
        cost: new Decimal(50),
        unlocked(){return hasUpgrade("a",11) || hasUpgrade("a",13) || player.t.total.gte(1)},
        effect(){return new Decimal(player.points).gte(1e24) ? new Decimal(25) : player.points.add(1).log10().add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      14: {
        title: "Prestige Bonus Enhancement",
        description: "<b>Prestige Bonus</b> uses a better formula.",
        cost: new Decimal(1000),
        unlocked(){return hasMilestone("a",1) || hasUpgrade("a",14) || player.t.total.gte(1)},
      },
      15: {
        title: "Ascension Bonus Enhancement",
        description: "<b>Ascension Bonus</b> uses a better formula.",
        cost: new Decimal(2e10),
        unlocked(){return hasMilestone("a",2) || hasUpgrade("a",15) || player.t.total.gte(1)},
      },
      21: {
        title: "Buyable Unlock II",
        description: "Unlock a second buyable.",
        cost: new Decimal(5e11),
        unlocked(){return hasUpgrade("a",15) || hasUpgrade("a",21) || player.t.total.gte(1)},
      },
      22: {
        title: "Upgrade Unlock",
        description: "Unlock some new prestige upgrades.",
        cost: new Decimal(1e100),
        unlocked(){return hasUpgrade("a",15) || hasUpgrade("a",22) || player.t.total.gte(1)},
      },
      23: {
        title: "Small Ascension Multiplier",
        description: "Multiply ascension point gain by 1000.",
        cost: new Decimal(1e275),
        unlocked(){return hasUpgrade("a",15) || hasUpgrade("a",23) || player.t.total.gte(1)},
      },
      24: {
        title: "Transcended Points",
        description: "Gain more transcension points based on points.",
        cost: new Decimal("1e320"),
        unlocked(){return hasUpgrade("t",15) || hasUpgrade("a",24)},
        effect(){return player.points.add(1).log10().add(1).cbrt()},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      25: {
        title: "Buyable Unlock III",
        description: "Unlock a buyable for Ascension.",
        cost: new Decimal("1e320"),
        unlocked(){return hasUpgrade("t",15) || hasUpgrade("a",25)},
      },
    },
    buyables: {
      11: {
        title: "Point Booster",
        cost(x) {return new Decimal(1e20).pow(x).times(1e300)},//x is the amount of buyables you have
        canAfford() { return player.a.points.gte(this.cost())},
        buy() {
           player.a.points = player.a.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Multiply point gain by 1e10 every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x point gain`},
        unlocked(){return hasUpgrade("a",25)},
        effect(x) { 
          mult2 = new Decimal(1e10).pow(x)
          return new Decimal(mult2)} //x is the amount of buyables you have
      } 
  },
    milestones: {
    0: {
        requirementDescription: "10 ascension points",
        effectDescription: "Keep prestige upgrades on reset.",
        done() { return player.a.points.gte(10) }
    },
    1: {
        requirementDescription: "500 ascension points",
        effectDescription: "Automate the prestige buyable.",
        done() { return player.a.points.gte(500) },
        toggles: [
          ["p","auto"]
        ]
    },
    2: {
        requirementDescription: "1e9 ascension points",
        effectDescription: "Gain 100% of prestige point gain every second.",
        done() { return player.a.points.gte(1e9) },
    },
    3: {
        requirementDescription: "1e100 ascension points",
        effectDescription: "Automate the 2nd prestige buyable.",
        done() { return player.a.points.gte(1e100) },
        unlocked() { return hasUpgrade("a",21) || hasMilestone("a",3) || player.t.total.gte(1) },
        toggles: [
          ["p","auto2"]
        ]
    },
  }
})
addLayer("t", {
    name: "transcension", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    shards: new Decimal(0), 
    }},
    tabFormat: [
    "main-display",
    "prestige-button",
    ["display-text", () => `You have ${format(player.t.shards)} shards, multiplying ${hasUpgrade("t",14)?`point, prestige point, and ascension point`:`point and prestige point`} gain by ${format(player.t.shards.add(1).pow(hasUpgrade("t",13)?1.5:0.5))}x`],
    "milestones",
    "buyables",
    "upgrades",
    ],
    color: "#9803FC",
    requires: new Decimal(1e280), // Can be a function that takes requirement increases into account
    resource: "transcension points", // Name of prestige currency
    baseResource: "ascension points", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.015, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(hasUpgrade("p",24)?3:1)
        mult = mult.mul(hasUpgrade("a",24)?upgradeEffect("a",24):1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for transcension points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["a"],
    layerShown(){return player.a.points.gte(1e280) || player.t.total.gte(1)},
    upgrades: {
      11: {
        title: "Transcendental Power",
        description: "Multiply prestige point gain by 1,000,000.",
        cost: new Decimal(1),
        unlocked(){return player.t.total.gte(2)},
      },
      12: {
        title: "Transcension Bonus",
        description: "Gain more ascension points based on total transcension points.",
        cost: new Decimal(1),
        unlocked(){return player.t.total.gte(2)},
        effect(){return player.t.total.pow(0.9).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      13: {
        title: "Shard Refinery",
        description: "The multiplier from shards is cubed.",
        cost: new Decimal(5),
        unlocked(){return player.t.total.gte(8)},
      },
      14: {
        title: "Divine Shards",
        description: "Shards now multiply ascension point gain.",
        cost: new Decimal(10),
        unlocked(){return player.t.total.gte(8)},
      },
      15: {
        title: "Upgrade Unlock II",
        description: "Unlock 2 new prestige upgrades and 2 new ascension upgrades.",
        cost: new Decimal(50),
        unlocked(){return hasUpgrade("t",14)},
      },
      21: {
        title: "Yet Another Multiplier",
        description: "Multiply ascension point gain by 1e15.",
        cost: new Decimal(2000),
        unlocked(){return hasUpgrade("p",25)},
      },
    },
    buyables: {
      11: {
        title: "Shard Generator",
        cost(x) {return new Decimal(1).mul(new Decimal(2.5).pow(x)).floor()},
        canAfford() { return player.t.points.gte(this.cost())},
        buy() {
           player.t.points = player.t.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Generate shards using this shard generator! Generate more shards with more generator levels.\nLevel: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: +${format(this.effect())} shards/sec`},
        effect(x) { 
          mult2 = new Decimal(x).mul(buyableEffect("t",12))
          return new Decimal(mult2)}
      },
      12: {
        title: "Shard Doubler",
        cost(x) {return new Decimal(10).mul(new Decimal(5).pow(x)).floor()},
        canAfford() { return player.t.points.gte(this.cost())},
        buy() {
           player.t.points = player.t.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Double shard gain every time you buy this!\nTimes bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x shards`},
        unlocked(){return hasUpgrade("p",25)},
        effect(x) { 
          mult2 = new Decimal(2).pow(x)
          return new Decimal(mult2)}
      },
    },
    milestones: {
    0: {
        requirementDescription: "3 total transcension points",
        effectDescription: "Keep prestige upgrades on reset.",
        done() { return player.t.total.gte(3) }
    },
    1: {
        requirementDescription: "4 total transcension points",
        effectDescription: "Keep ascension milestones on reset.",
        done() { return player.t.total.gte(4) },
    },
    2: {
        requirementDescription: "5 total transcension points",
        effectDescription: "Keep ascension upgrades on reset.",
        done() { return player.t.total.gte(5) },
    },
    3: {
        requirementDescription: "8 total transcension points",
        effectDescription: "Gain 100% of ascension point gain per second.",
        done() { return player.t.total.gte(8) },
    },
    4: {
        requirementDescription: "12 total transcension points",
        effectDescription: "Buy max buyables.",
        done() { return player.t.total.gte(12) },
    },
  },
    update(diff) {
      player.t.shards = player.t.shards.add(buyableEffect("t", 11).mul(diff))
    },
})