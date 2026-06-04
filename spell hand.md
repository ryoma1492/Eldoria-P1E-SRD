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
  // --- MASTER ABILITY MAPS ---
  const CLASS_NAMES = { 1: "Magus", 2: "Wizard", 3: "Fighter", 4: "Rogue", 5: "Bard" };
  const AUTOMATED_FEATURES = {
    1: [
      { name: "Spell Combat", lvl: 1, time: "Full-Round", range: "Self", desc: "Attack with a weapon and cast a spell concurrently." },
      { name: "Spellstrike", lvl: 2, time: "Varies", range: "Touch", desc: "Deliver touch spells directly through a melee weapon strike." }
    ],
    5: [
      { name: "Performance: Inspire Courage", lvl: 1, time: "Standard", range: "30 ft", desc: "+1 morale vs fear, +1 competence to hit/damage." },
      { name: "Performance: Suggestion", lvl: 6, time: "Standard", range: "Audible", desc: "Target must follow a reasonable course of action on failed Will save." }
    ]
  };

  // --- ASYNC DATABASE CONTROLLER ---
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id') ? urlParams.get('id').toLowerCase().trim() : null;

  const sheetId = '1uP_IiVgExtVT5xd6Tgk63k-NLLV7hS5EWDXIsKyFsdo';

  if (!targetId) {
    document.getElementById('char-title').innerText = "Tactical Deck Offline";
    document.getElementById('card-grid').innerHTML = "<p>⚠️ Please specify a character ID token (e.g., <code>?id=ryan</code>).</p>";
  } else {
    initTabletopPipeline();
  }

  async function initTabletopPipeline() {
    try {
      // 1. Fetch Player Roster Tab (sheet name: 'Players')
      const playerUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Players&tqx=out:json`;
      const playerRes = await fetch(playerUrl).then(r => r.text());
      const playerData = JSON.parse(playerRes.substring(47, playerRes.length - 2));
      const playerRows = playerData.table.rows;

      // Find the character match matching Column A (index 0)
      let matchedRecord = null;
      for (let row of playerRows) {
        if (row.c[0] && row.c[0].v.toString().toLowerCase().trim() === targetId) {
          matchedRecord = row;
          break;
        }
      }

      if (!matchedRecord) {
        document.getElementById('char-title').innerText = "Character Not Found";
        document.getElementById('card-grid').innerHTML = `<p>❌ No player token found matching "${targetId}" in the master database.</p>`;
        return;
      }

      // 2. Extract Data Fields from Row Configuration
      const charName = matchedRecord.c[1] ? matchedRecord.c[1].v : "Unknown Hero";
      const pcString = matchedRecord.c[2] ? matchedRecord.c[2].v.toString() : "";
      const slotString = matchedRecord.c[3] ? matchedRecord.c[3].v.toString() : "";
      const spellString = matchedRecord.c[4] ? matchedRecord.c[4].v.toString() : "";

      const playerSpells = spellString ? spellString.split(',') : [];
      const playerSlots = slotString ? slotString.split(',') : [];

      // 3. Process Class Multi-Profile Layouts
      let characterClasses = [];
      if (pcString) {
        pcString.split(',').forEach(token => {
          const [classId, level] = token.split('~').map(num => parseInt(num));
          if (classId && level) characterClasses.push({ id: classId, name: CLASS_NAMES[classId] || "Unknown", lvl: level });
        });
      }

      // 4. Update Header Profile Layout
      const classBanner = characterClasses.map(c => `${c.name} ${c.lvl}`).join(' / ');
      document.getElementById('char-title').innerText = `${charName} — ${classBanner || "Adventurer"}`;
      renderSlots(playerSlots);

      // 5. Calculate Class Features Unlocked
      let activeFeatures = [];
      characterClasses.forEach(c => {
        const ruleset = AUTOMATED_FEATURES[c.id] || [];
        ruleset.forEach(feat => {
          if (c.lvl >= feat.lvl) activeFeatures.push(feat);
        });
      });

      // 6. Fetch Master Spell Compendium Tab
      const masterUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=spellactioncard&tqx=out:json`;
      const masterRes = await fetch(masterUrl).then(r => r.text());
      const masterData = JSON.parse(masterRes.substring(47, masterRes.length - 2));
      const sheetRows = masterData.table.rows;

      // 7. Render Everything Natively
      renderDeck(sheetRows, playerSpells, activeFeatures);

    } catch (err) {
      document.getElementById('card-grid').innerHTML = "<p>❌ Matrix Error: Failed to load cross-referenced tabs.</p>";
      console.error(err);
    }
  }

  function renderSlots(slots) {
    const tracker = document.getElementById('slot-tracker');
    if (slots.length === 0 || slots[0] === "") { tracker.innerHTML = "<em>No spell slots tracked.</em>"; return; }
    
    let html = '<strong>Slots Left:</strong> ';
    slots.forEach((count, index) => {
      html += `<span style="margin-right: 12px; display: inline-block; background: var(--light); padding: 2px 8px; border-radius: 4px;">Lvl ${index + 1}: <strong>${count}</strong></span>`;
    });
    tracker.innerHTML = html;
  }

  function renderDeck(sheetRows, spellIds, features) {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = ''; 

    // Draw Class Features
    features.forEach(feat => {
      const card = document.createElement('div');
      card.className = 'spell-card';
      card.style.borderLeft = "4px solid #9b59b6";
      card.innerHTML = `
        <div>
          <span class="action-badge action-ability">${feat.time}</span>
          <h3 style="margin: 5px 0 0 0; font-size: 1.2rem;">${feat.name}</h3>
          <small style="opacity: 0.7; font-weight: bold; color: #9b59b6;">Class Ability</small>
          <p class="spell-meta"><strong>Range:</strong> ${feat.range}</p>
          <p style="font-size: 0.85rem; margin-top: 8px; line-height: 1.3;">${feat.desc}</p>
        </div>
        <div class="card-footer-links">
          <button class="cast-btn" onclick="this.parentElement.parentElement.style.opacity=0.3; this.innerText='USED'; this.style.background='var(--gray)'; this.disabled=true;">Use Ability</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Draw Spreadsheet Spell Rows
    spellIds.forEach(id => {
      const rowIndex = parseInt(id) - 2; 
      const row = sheetRows[rowIndex];

      if (!row) return;

      const name = row.c[0] ? row.c[0].v : "Unknown Spell";
      const school = row.c[1] ? row.c[1].v : "Universal";
      const castingTime = row.c[4] ? row.c[4].v : "1 standard action"; 
      const range = row.c[7] ? row.c[7].v : "Personal";
      const fullDetailsUrl = row.c[70] ? row.c[70].v : null;

      let actionClass = 'action-standard';
      const lowerTime = castingTime.toLowerCase();
      if (lowerTime.includes('swift')) actionClass = 'action-swift';
      else if (lowerTime.includes('move')) actionClass = 'action-move';
      else if (lowerTime.includes('full')) actionClass = 'action-full';

      const card = document.createElement('div');
      card.className = 'spell-card';
      
      let infoButtonHtml = fullDetailsUrl 
        ? `<a class="info-link" href="${fullDetailsUrl}" target="_blank" title="View Full Rules">📖</a>`
        : '';

      card.innerHTML = `
        <div>
          <span class="action-badge ${actionClass}">${castingTime.split(',')[0]}</span>
          <h3 style="margin: 5px 0 0 0; font-size: 1.2rem;">${name}</h3>
          <small style="opacity: 0.7;">${school}</small>
          <p class="spell-meta"><strong>Range:</strong> ${range}</p>
        </div>
        <div class="card-footer-links">
          <button class="cast-btn" onclick="this.parentElement.parentElement.style.opacity=0.3; this.innerText='CAST'; this.style.background='var(--gray)'; this.disabled=true;">Cast</button>
          ${infoButtonHtml}
        </div>
      `;
      grid.appendChild(card);
    });
  }
</script>