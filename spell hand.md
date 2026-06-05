---
title: Combat Tactical Hand
layout: page
---
<div id="combat-ui">
  <div id="char-header" style="margin-bottom: 15px; padding: 15px; background: var(--secondary); border-radius: 8px; border-left: 4px solid var(--placeholder);">
    <h2 id="char-title" style="margin: 0 0 5px 0; font-size: 1.4rem;">Connecting to the table matrix...</h2>
    <div id="slot-tracker" style="font-size: 0.95rem; margin-top: 10px; opacity: 0.9;"></div>
  </div>

  <div id="card-grid">
    <p>Shuffling your tactical deck...</p>
  </div>
</div>

<style>
  #card-grid {
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
    gap: 20px;
    margin-top: 20px;
  }

  .spell-card {
    border: 2px solid var(--gray);
    border-radius: 12px;
    padding: 15px;
    background: var(--page-background);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s, border-color 0.2s;
  }

  .spell-card:hover {
    transform: translateY(-5px);
    border-color: var(--tertiary);
  }

  .action-badge {
    align-self: flex-start;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .action-standard { background: #d9534f; color: white; }
  .action-move { background: #f0ad4e; color: white; }
  .action-swift { background: #5bc0de; color: white; }
  .action-full { background: #5cb85c; color: white; }
  .action-ability { background: #9b59b6; color: white; }

  .spell-meta {
    font-size: 0.9rem; 
    margin-top: 10px; 
    color: var(--darkgray);
  }

  .card-footer-links {
    margin-top: 15px;
    display: flex;
    gap: 10px;
  }

  .cast-btn {
    flex: 2;
    padding: 8px; 
    background: var(--light); 
    border: 1px solid var(--gray); 
    color: var(--dark);
    font-weight: bold;
    border-radius: 4px; 
    cursor: pointer;
    transition: background 0.2s;
  }

  .cast-btn:hover {
    background: var(--highlight);
  }

  .info-link {
    flex: 1;
    padding: 8px;
    background: var(--secondary);
    border: 1px solid var(--gray);
    border-radius: 4px;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    font-size: 0.9rem;
    color: var(--dark) !important;
  }
  
  .info-link:hover {
    background: var(--highlight);
  }
</style>

<script>
<script type="text/javascript">
// <![CDATA[

// 1. Paste your clean, restored JavaScript here.
// 2. Quartz will completely ignore everything between the CDATA lines.
// 3. Make sure to fix the missing function at the very end:

// 1. Automatically grab query parameters from the window's browser location link
const urlParams = new URLSearchParams(window.location.search);

// 2. Extract the value matching ?id=yourvalue or ?target=yourvalue 
const targetId = urlParams.get('id') ? urlParams.get('id').toLowerCase().trim() : null;

const sheetId = '1uP_IiVgExtVT5xd6Tgk63k-NLLV7hS5EWDXIsKyFsdo';

// --- CONFIGURATION & MAPS (Quartz-Safe Version) ---
const CLASS_NAMES = { 
  1: 'Sorcerer', 2: 'Wizard', 3: 'Cleric', 4: 'Druid', 5: 'Ranger', 
  6: 'Bard', 7: 'Paladin', 8: 'Alchemist', 9: 'Summoner', 10: 'Witch', 
  11: 'Inquisitor', 12: 'Oracle', 13: 'Antipaladin', 14: 'Magus', 15: 'Bloodrager', 
  16: 'Shaman', 17: 'Psychic', 18: 'Medium', 19: 'Mesmerist', 20: 'Occultist', 
  21: 'Spiritualist', 22: 'Skald', 23: 'Investigator', 24: 'Hunter', 25: 'Summoner_unchained', 
  26: 'Barbarian', 27: 'Fighter', 28: 'Monk', 29: 'Rogue', 30: 'Gunslinger', 
  31: 'Cavalier', 32: 'Shifter', 33: 'Vigilante', 34: 'Unchained Barbarian', 35: 'Unchained Monk', 
  36: 'Unchained Rogue', 37: 'Arcanist', 38: 'Bloodrager', 39: 'Hunter', 40: 'Investigator', 
  41: 'Shaman', 42: 'Skald', 43: 'Brawler', 44: 'Slayer', 45: 'Swashbuckler', 
  46: 'Warpriest', 47: 'Kineticist'
};

const CLASS_COLUMN_MAP = {
  'sorcerer': 'sor', 'wizard': 'wiz', 'cleric': 'cleric', 'druid': 'druid', 'ranger': 'ranger',
  'bard': 'bard', 'paladin': 'paladin', 'alchemist': 'alchemist', 'summoner': 'summoner',
  'witch': 'witch', 'inquisitor': 'inquisitor', 'oracle': 'oracle', 'antipaladin': 'antipaladin',
  'magus': 'magus', 'bloodrager': 'bloodrager', 'shaman': 'shaman', 'psychic': 'psychic',
  'medium': 'medium', 'mesmerist': 'mesmerist', 'occultist': 'occultist', 'spiritualist': 'spiritualist',
  'skald': 'skald', 'investigator': 'investigator', 'hunter': 'hunter', 'summoner_unchained': 'summoner_unchained'
};

if (!targetId) {
  document.getElementById('char-title').innerText = 'Tactical Deck Offline';
  document.getElementById('card-grid').innerHTML = '<p>⚠️ Please specify a character ID token.</p>';
} else {
  initTabletopPipeline();
}

async function initTabletopPipeline() {
  try {
    const playerUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Players&tqx=out:json`;
    const playerRes = await fetch(playerUrl).then(r => r.text());
    const playerData = JSON.parse(playerRes.substring(47, playerRes.length - 2));
    const playerRows = playerData.table.rows;

    let matchedRecord = null;
    for (let row of playerRows) {
      if (row.c[0] && row.c[0].v.toString().toLowerCase().trim() === targetId) {
        matchedRecord = row;
        break;
      }
    }

    if (!matchedRecord) {
      document.getElementById('char-title').innerText = 'Character Not Found';
      document.getElementById('card-grid').innerHTML = `<p>❌ No player token found matching "${targetId}".</p>`;
      return;
    }

    const charName = matchedRecord.c[1] ? matchedRecord.c[1].v : 'Unknown Hero';
    const pcString = matchedRecord.c[2] ? matchedRecord.c[2].v.toString() : '';
    const slotString = matchedRecord.c[3] ? matchedRecord.c[3].v.toString() : '';
    const spellString = matchedRecord.c[4] ? matchedRecord.c[4].v.toString() : '';

    let finalSpellAndAbilityIds = spellString ? spellString.split(',').map(s => s.trim()) : [];
    const playerSlots = slotString ? slotString.split(',') : [];

    let maxAllowedLevel = 0; 
    let characterClasses = [];
    
    if (pcString) {
      pcString.split(',').forEach(token => {
        const [classId, level] = token.split('~').map(num => parseInt(num));
        if (classId && level) {
          const className = CLASS_NAMES[classId] || 'Unknown';
          characterClasses.push({ id: classId, name: className, lvl: level });
          
          if (level > maxAllowedLevel) {
            maxAllowedLevel = level;
          }
          
          const translationKey = `classability_${className.toLowerCase().trim()}`;
          for (let row of playerRows) {
            if (row.c[0] && row.c[0].v.toString().toLowerCase().trim() === translationKey) {
              const abilityString = row.c[4] ? row.c[4].v.toString() : '';
              if (abilityString) {
                const abilityIds = abilityString.split(',').map(s => s.trim());
                finalSpellAndAbilityIds = finalSpellAndAbilityIds.concat(abilityIds);
              }
              break;
            }
          }
        }
      });
    }

    const classBanner = characterClasses.map(c => `${c.name} ${c.lvl}`).join(' / ');
    document.getElementById('char-title').innerText = `${charName} — ${classBanner || 'Adventurer'}`;
    renderSlots(playerSlots);

    // Fetch Master Spell Compendium Tab
    const masterUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=spellactioncard&tqx=out:json`;
    const masterRes = await fetch(masterUrl).then(r => r.text());
    const masterData = JSON.parse(masterRes.substring(47, masterRes.length - 2));
    
    // BUILD COLUMN HEADER INDEX MAP DYNAMICALLY
    const headers = masterData.table.cols.map(col => col.label ? col.label.toLowerCase().trim() : '');
    const sheetRows = masterData.table.rows;

    renderDeck(sheetRows, finalSpellAndAbilityIds, maxAllowedLevel, characterClasses, headers);

  } catch (err) {
    document.getElementById('card-grid').innerHTML = '<p>❌ Matrix Error: Failed to load cross-referenced tabs.</p>';
    console.error(err);
  }
}

function renderSlots(slots) {
  const tracker = document.getElementById('slot-tracker');
  if (slots.length === 0 || slots[0] === '') { tracker.innerHTML = '<em>No spell slots tracked.</em>'; return; }
  
  let html = '<strong>Slots Left:</strong> ';
  slots.forEach((count, index) => {
    html += `<span style="margin-right: 12px; display: inline-block; background: var(--light); padding: 2px 8px; border-radius: 4px;">Lvl ${index + 1}: <strong>${count}</strong></span>`;
  });
  tracker.innerHTML = html;
}

function getTrueLevel(row, characterClasses, headers) {
  const school = row.c[1] ? row.c[1].v : '';
  const descriptor = row.c[3] ? row.c[3].v : '';
  const isClassAbility = !school && descriptor;

  if (isClassAbility) {
    return row.c[4] && row.c[4].v !== null ? parseInt(row.c[4].v) : 0;
  }

  let detectedSpellLevel = null;

  for (let charClass of characterClasses) {
    const colName = CLASS_COLUMN_MAP[charClass.name.toLowerCase().trim()];
    if (!colName) continue;

    const colIndex = headers.indexOf(colName);
    if (colIndex !== -1 && row.c[colIndex] && row.c[colIndex].v !== null && row.c[colIndex].v !== 'NULL') {
      const classLvl = parseInt(row.c[colIndex].v);
      if (detectedSpellLevel === null || classLvl < detectedSpellLevel) {
        detectedSpellLevel = classLvl;
      }
    }
  }

  if (detectedSpellLevel === null) {
    const rawColE = row.c[4] ? row.c[4].v.toString() : '';
    const parsedInt = parseInt(rawColE);
    return !isNaN(parsedInt) ? parsedInt : 0;
  }

  return detectedSpellLevel;
}

function renderDeck(sheetRows, combinedIds, maxLevel, characterClasses, headers) {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = ''; 

  let validCards = [];

  combinedIds.forEach(id => {
    const rowIndex = parseInt(id) - 2; 
    const row = sheetRows[rowIndex];
    if (!row) return;

    const school = row.c[1] ? row.c[1].v : '';
    const descriptor = row.c[3] ? row.c[3].v : '';
    const isClassAbility = !school && descriptor;

    const calculatedLevel = getTrueLevel(row, characterClasses, headers);
    
    // Apply Level Filter Gate
    if (calculatedLevel > maxLevel) return;

    validCards.push({
      rowData: row,
      displayLevel: calculatedLevel,
      isAbility: isClassAbility
    });
  });

  // --- MULTI-TIER SORT ENGINE ---
  validCards.sort((a, b) => {
    if (a.isAbility !== b.isAbility) {
      return a.isAbility ? 1 : -1; 
    }
    return a.displayLevel - b.displayLevel;
  });

  // Render processed deck elements
  validCards.forEach(cardItem => {
    const row = cardItem.rowData;
    const spellLevel = cardItem.displayLevel;
    const isClassAbility = cardItem.isAbility;

    const name = row.c[0] ? row.c[0].v : 'Unknown Action';
    const school = row.c[1] ? row.c[1].v : '';
    const descriptor = row.c[3] ? row.c[3].v : '';
    const castingTime = row.c[5] ? row.c[5].v : 'Standard Action'; 
    const range = row.c[8] ? row.c[8].v : 'N/A';
    
    // --- FIXED COLUMN ALIGNMENTS ---
    const description = row.c[17] ? row.c[17].v : ''; 
    const descFormatted = row.c[18] ? row.c[18].v : null; 

    const fullDetailsUrl = row.c[70] ? row.c[70].v : null; 

    let actionClass = 'action-standard';
    const lowerTime = castingTime.toLowerCase();
    if (lowerTime.includes('swift')) actionClass = 'action-swift';
    else if (lowerTime.includes('move')) actionClass = 'action-move';
    else if (lowerTime.includes('full')) actionClass = 'action-full';
    else if (isClassAbility) actionClass = 'action-ability';

    const card = document.createElement('div');
    card.className = 'spell-card';
    
    if (isClassAbility) {
      card.style.borderLeft = '4px solid #9b59b6';
    }

    let infoButtonHtml = fullDetailsUrl 
      ? `<a class="info-link" href="${fullDetailsUrl}" target="_blank" title="View Rules">📖</a>`
      : '';

    const bodyContent = descFormatted ? descFormatted : `<p style="font-size: 0.85rem; margin-top: 8px; line-height: 1.3;">${description}</p>`;

    card.innerHTML = `
      <div>
        <span class="action-badge ${actionClass}">${castingTime.split(',')[0]}</span>
        <h3 style="margin: 5px 0 0 0; font-size: 1.2rem;">${name}</h3>
        <small style="opacity: 0.7; font-weight: bold;">${isClassAbility ? `${descriptor} Feature` : school}</small>
        <p class="spell-meta"><strong>Range:</strong> ${range} | <strong>Lvl:</strong> ${spellLevel}</p>
        <div class="ability-details-body" style="margin-top: 8px;">
          ${bodyContent}
        </div>
      </div>
      <div class="card-footer-links">
        <button class="cast-btn" onclick="handleCardActivation(this, ${isClassAbility})">
          ${isClassAbility ? 'Use Ability' : 'Cast'}
        </button>
        ${infoButtonHtml}
      </div>
    `;
    grid.appendChild(card);
  });
}

function handleCardActivation(btnElement, isAbility) {
  const cardFrame = btnElement.parentElement.parentElement;
  cardFrame.style.opacity = 0.3;
  btnElement.innerText = isAbility ? 'USED' : 'CAST';
  btnElement.style.background = 'var(--gray)';
  btnElement.disabled = true;
}


// ]]>

</script>