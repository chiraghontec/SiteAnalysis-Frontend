# Leaflet Draw Toolkit (Freehand + GeoJSON + Nominatim)

A no-build, vanilla HTML/JS starter that includes:

- **Leaflet** map with OpenStreetMap tiles
- **Leaflet-Geoman (leaflet.pm)** for drawing/editing shapes
- **Freehand** drawing (hold **SHIFT** while drawing Polygon/Polyline)
- **Undo/Redo**, **Clear**, **Erase**
- **Live GeoJSON** preview + **download**
- **Nominatim** search (via `leaflet-control-geocoder`)

## Quick start

Just open `index.html` in a browser. No build tools required.

> If the map ever looks blank on first load, it's almost always CSS height. This template fixes it with `#map { height: 100% }` and uses a grid that fills the viewport.

## Tips

- **Freehand:** Click **Freehand** then hold **SHIFT** while dragging to draw freehand polygons. Finish with mouseup.
- **Undo/Redo:** Works by snapshotting GeoJSON after every create/edit/delete.
- **Export:** Click **Download** to save `drawn-features.geojson`.

## Project structure

```
.
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Licenses

- Leaflet © OSM contributors (BSD-2-Clause)
- Leaflet-Geoman Free (MIT)
- leaflet-control-geocoder (BSD-2-Clause)
