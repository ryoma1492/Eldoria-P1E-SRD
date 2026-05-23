# Sunken Sanctum: Map Engine Guide

Welcome to the **Sunken Sanctum Engine**. This tool is designed for high-speed map creation, featuring a dynamic terrain system, custom platform pathing, and a portable export format for live tabletop sessions.

## 🛠️ Editor Toolbar Reference

### Terrain Painting
* **Color Palette (Wall, Floor, Acc 1, Acc 2, Other):** Use the color pickers to define your style. Select a tool to paint that terrain type onto the grid.
* **Erase (Deep):** Returns hexes to their default "Deep" state (or transparent state if an image background is active).
* **Outline:** Paints traversable hex borders without filling the interior—ideal for marking paths on top of background images.

### River & Platform
* **River Waypoints:** Set the flow of the current. Click on the map to drop pathing nodes. The River will automatically fill the specified radius around your line.
* **Platform (⭐ Store Plat):** Sculpt your ideal raft using terrain tools, select the area with the **Select** tool, and click **Store Plat**. This saves the shape as your permanent moving platform.

### Selection & Buffers
* **Select:** Drag to define a rectangular area.
* **Copy/Paste:** Standard clipboard operations for your terrain.
* **Store 1:** Save a prefab to a secondary memory bank.
* **Paste 1:** Drops your stored prefab at the mouse location.

### Canvas & Export
* **Resize:** Change map dimensions (60x60 default). 
* **Export HTML:** Generates a standalone, interactive map file. This file contains all your logic, colors, and pathing and can be opened in any web browser without needing the editor.

---

## 🎮 Player Controls (Exported Map)

Once you have exported your map, open it in any browser. The interface is stripped back to focus on your session, with the following **hidden hotkeys** for live control:

| Key | Action |
| :--- | :--- |
| **A / Enter** | **Advance Platform** along the river path. |
| **R** | **Reset View** (centers the map and resets zoom). |
| **V** | **Reverse Current** (toggles flow direction). |
| **H** | **Hide/Show River** (toggles river path visibility). |
| **1 - 9** | **Jump to Waypoint** (instantly snaps platform to specific key nodes). |

---

## 🎨 Advanced Theming Tips

* **Background Images:** Use the **Set BG** button to upload a custom texture or map image. If an image is loaded, the engine will prioritize it as the backdrop.
* **Custom Deep Water:** Use the **Deep Color** picker to tint the oscillating water effect to match your map's biome (e.g., green for swamp, dark blue for abyss).

*Pro-Tip: When exporting a map with a high-resolution background image, the resulting `.html` file size may increase as the image is embedded directly into the file for total portability.*
