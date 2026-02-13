---
tags:
  - monster
statblock: inline
aliases:
  - King
---
```statblock
layout: Basic Pathfinder 1e Layout
source: "Homebrew"
Monster_CR: 9
Monster_XP: 6400
name: King Avaric the Gilded
alignment: LE
size: Medium
type: humanoid
subtype: human
INI: +6
senses: Perception +12
AC: 23, touch 13, flat-footed 20 (+8 armor, +2 Dex, +3 natural)
HP: 112
hit_dice: 12d8+48
saves: Fort +11, Ref +8, Will +10
DR: 5/—
resist: see Adaptive Consumption
speed: 30 ft.
melee: +1 longsword +15/+10 (1d8+6/19–20)
ranged: dagger +11 (1d4+4)
special_attacks: Adaptive Consumption, Royal Decree, Devouring Strike
space: 5 ft.
reach: 5 ft.
pf1e_stats: [18, 14, 18, 12, 14, 16]
BAB: +9
CMB: +13
CMD: 25
feats: Power Attack, Cleave, Improved Initiative, Iron Will, Toughness, Weapon Focus (longsword)
skills: Diplomacy +18, Intimidate +18, Knowledge (nobility) +14, Perception +12, Sense Motive +12
languages: Common, Draconic
gear:
  - name: combat
    desc: +1 full plate, +1 longsword, ring of protection +1
  - name: treasure
    desc: royal signet, treasury key (vault partially dissolved)

special_abilities:
  - name: Adaptive Consumption (Su)
    desc: As a swift action once every 1d4 rounds, Avaric may consume a held object, adjacent unattended object, or elemental source (fire, holy water, etc.). For 3 rounds, he gains resistance 10 against the last damage type consumed. If a magic item is consumed, he instead gains spell resistance 21 for 1 round.
  - name: Devouring Strike (Su)
    desc: Once per round when Avaric hits with a melee attack, he heals 5 hit points if the target is living.
  - name: Royal Decree (Su)
    desc: As a standard action, Avaric commands obedience. All creatures within 30 ft. must succeed at a DC 18 Will save or be staggered for 1 round as their will falters. This is a mind-affecting compulsion. The save DC is Charisma-based.

ecology:
  - name: Environment
    desc: any urban
  - name: Organisation
    desc: solitary (with guards)
  - name: Treasure
    desc: triple standard

desc_short: A regal figure in gilded armor whose veins faintly pulse with something not entirely human.
```
