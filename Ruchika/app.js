// ------- Map setup -------
const map = L.map('map', { center: [12.9716, 77.5946], zoom: 12 });
setTimeout(() => map.invalidateSize(), 0);
window.addEventListener('load', () => map.invalidateSize());

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Remove Geoman's native toolbar, we use our own
map.pm.addControls({
  position: 'topleft',
  drawMarker: false, drawPolygon: false, drawPolyline: false,
  drawRectangle: false, drawCircle: false,
  editMode: false, dragMode: false, cutPolygon: false, removalMode: false
});

// Layer group for our shapes (export/history)
const drawn = L.featureGroup().addTo(map);

let selectedLayer = null;

// ------- Change listeners -------
map.on('pm:create', (e) => {
  drawn.addLayer(e.layer);
  attachSelectable(e.layer);
  setSelected(e.layer);
  updateMetrics(e.layer);
  snapshot();
  renderGeoJSON();
});
map.on('pm:remove', () => {
  if (selectedLayer && !drawn.hasLayer(selectedLayer)) selectedLayer = null;
  setMetricsText('–');
  snapshot(); renderGeoJSON();
});
map.on('pm:edit', (e) => {
  if (selectedLayer === e.layer) updateMetrics(e.layer);
  snapshot(); renderGeoJSON();
});

map.pm.setGlobalOptions({
  allowSelfIntersection: true, continueDrawing: false, snappable: true, snapDistance: 10
});

// ------- UI helpers -------
const $ = (id) => document.getElementById(id);
const buttons = [
  'btn-marker','btn-polygon','btn-polyline','btn-rectangle','btn-circle',
  'btn-freehand','btn-freehand-line','btn-edit','btn-drag','btn-delete'
];
function activate(btnId){ buttons.forEach(id => $(id)?.classList.remove('active')); if (btnId) $(btnId)?.classList.add('active'); }
function stopAll(){
  map.pm.disableDraw(); map.pm.disableGlobalEditMode(); map.pm.disableGlobalDragMode(); map.pm.disableGlobalRemovalMode();
  disableFreehand(); disableFreehandLine(); activate(null);
}

// ------- Built-in Geoman draw/edit via our buttons -------
$('btn-marker').onclick   = () => { stopAll(); activate('btn-marker');   map.pm.enableDraw('Marker'); };
$('btn-polygon').onclick  = () => { stopAll(); activate('btn-polygon');  map.pm.enableDraw('Polygon', { finishOn:'dblclick' }); };
$('btn-polyline').onclick = () => { stopAll(); activate('btn-polyline'); map.pm.enableDraw('Line',    { finishOn:'dblclick' }); };
$('btn-rectangle').onclick= () => { stopAll(); activate('btn-rectangle');map.pm.enableDraw('Rectangle'); };
$('btn-circle').onclick   = () => { stopAll(); activate('btn-circle');   map.pm.enableDraw('Circle', { radius:200 }); };
$('btn-edit').onclick     = () => { stopAll(); activate('btn-edit');     map.pm.enableGlobalEditMode({}); };
$('btn-drag').onclick     = () => { stopAll(); activate('btn-drag');     map.pm.enableGlobalDragMode(); };
$('btn-delete').onclick   = () => { stopAll(); activate('btn-delete');   map.pm.enableGlobalRemovalMode(); };

// ------- Simplify controls -------
const simplifyRange = $('simplify-range');
const simplifyHQ = $('simplify-hq');
const simplifyVal = $('simplify-val');
function toleranceFromSlider(v) {
  // Map 0..10 -> 0 .. 0.001 (degrees). 0 = off.
  return (Number(v) / 10000); // 0, 0.0001, 0.0002, ... 0.0010
}
function updateSimplifyLabel(){
  const t = toleranceFromSlider(simplifyRange.value);
  simplifyVal.textContent = t ? `t=${t.toFixed(4)}` : 't=off';
}
simplifyRange.addEventListener('input', updateSimplifyLabel);
simplifyHQ.addEventListener('change', updateSimplifyLabel);
updateSimplifyLabel();

// ------- CUSTOM SMOOTH FREEHAND (Polygon) -------
let fhActive=false, fhTemp=null, fhLastPx=null;
function enableFreehand(){
  if (fhActive) return; fhActive=true;
  map.dragging.disable(); map.getContainer().classList.add('cursor-crosshair');
  map.on('mousedown', fhDown); map.on('mousemove', fhMove); map.on('mouseup', fhUp);
}
function disableFreehand(){
  if (!fhActive) return; fhActive=false;
  map.dragging.enable(); map.getContainer().classList.remove('cursor-crosshair');
  map.off('mousedown', fhDown); map.off('mousemove', fhMove); map.off('mouseup', fhUp);
  if (fhTemp){ map.removeLayer(fhTemp); fhTemp=null; fhLastPx=null; }
}
function fhDown(e){ fhTemp=L.polyline([e.latlng],{color:'red',weight:2,interactive:false}).addTo(map); fhLastPx=map.latLngToContainerPoint(e.latlng); }
function fhMove(e){
  if (!fhTemp) return;
  const p=map.latLngToContainerPoint(e.latlng);
  if (!fhLastPx || p.distanceTo(fhLastPx)>=2){ const latlngs=fhTemp.getLatLngs(); latlngs.push(e.latlng); fhTemp.setLatLngs(latlngs); fhLastPx=p; }
}
function fhUp(){
  if (!fhTemp) return;
  const latlngs=fhTemp.getLatLngs(); map.removeLayer(fhTemp); fhTemp=null; fhLastPx=null;
  if (latlngs.length<2){ disableFreehand(); return; }
  const ring=[...latlngs, latlngs[0]];
  let gj=L.polygon(ring,{color:'red'}).toGeoJSON();

  // Turf.simplify if tolerance > 0
  const tol = toleranceFromSlider(simplifyRange.value);
  if (tol>0){ gj = turf.simplify(gj, { tolerance: tol, highQuality: simplifyHQ.checked }); }

  const polyLayer = L.geoJSON(gj,{style:{color:'red'}}).getLayers()[0];
  drawn.addLayer(polyLayer); attachSelectable(polyLayer); setSelected(polyLayer); updateMetrics(polyLayer);
  try{ polyLayer.pm.enable(); }catch(e){}
  snapshot(); renderGeoJSON();

  // return to normal cursor after one shape
  disableFreehand(); activate(null);
}
$('btn-freehand').onclick = () => { stopAll(); activate('btn-freehand'); enableFreehand(); };

// ------- CUSTOM SMOOTH FREEHAND (Polyline) -------
let flActive=false, flTemp=null, flLastPx=null;
function enableFreehandLine(){
  if (flActive) return; flActive=true;
  map.dragging.disable(); map.getContainer().classList.add('cursor-crosshair');
  map.on('mousedown', flDown); map.on('mousemove', flMove); map.on('mouseup', flUp);
}
function disableFreehandLine(){
  if (!flActive) return; flActive=false;
  map.dragging.enable(); map.getContainer().classList.remove('cursor-crosshair');
  map.off('mousedown', flDown); map.off('mousemove', flMove); map.off('mouseup', flUp);
  if (flTemp){ map.removeLayer(flTemp); flTemp=null; flLastPx=null; }
}
function flDown(e){ flTemp=L.polyline([e.latlng],{color:'blue',weight:2,interactive:false}).addTo(map); flLastPx=map.latLngToContainerPoint(e.latlng); }
function flMove(e){
  if (!flTemp) return;
  const p=map.latLngToContainerPoint(e.latlng);
  if (!flLastPx || p.distanceTo(flLastPx)>=2){ const latlngs=flTemp.getLatLngs(); latlngs.push(e.latlng); flTemp.setLatLngs(latlngs); flLastPx=p; }
}
function flUp(){
  if (!flTemp) return;
  const latlngs=flTemp.getLatLngs(); map.removeLayer(flTemp); flTemp=null; flLastPx=null;
  if (latlngs.length<2){ disableFreehandLine(); return; }
  let gj=L.polyline(latlngs,{color:'blue'}).toGeoJSON();

  const tol = toleranceFromSlider(simplifyRange.value);
  if (tol>0){ gj = turf.simplify(gj, { tolerance: tol, highQuality: simplifyHQ.checked }); }

  const lineLayer = L.geoJSON(gj,{style:{color:'blue'}}).getLayers()[0];
  drawn.addLayer(lineLayer); attachSelectable(lineLayer); setSelected(lineLayer); updateMetrics(lineLayer);
  try{ lineLayer.pm.enable(); }catch(e){}
  snapshot(); renderGeoJSON();

  // return to normal cursor after one shape
  disableFreehandLine(); activate(null);
}
$('btn-freehand-line').onclick = () => { stopAll(); activate('btn-freehand-line'); enableFreehandLine(); };

// ------- Clear / Export -------
$('btn-clear').onclick = () => { stopAll(); drawn.clearLayers(); selectedLayer=null; snapshot(); renderGeoJSON(); setMetricsText('–'); };
$('btn-export').onclick = () => {
  const gj = exportGeoJSON();
  const blob = new Blob([JSON.stringify(gj, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='drawn-features.geojson';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ------- Undo / Redo -------
let history=[], future=[];
function snapshot(){ history.push(exportGeoJSON()); if (history.length>100) history.shift(); future=[]; }
function loadFrom(gj){
  drawn.clearLayers();
  L.geoJSON(gj,{
    pointToLayer:(f,latlng)=>L.marker(latlng),
    style:()=>({color:'#0065ff'})
  }).eachLayer(l=>{ drawn.addLayer(l); try{ l.pm.enable(); }catch(e){} attachSelectable(l); });
  renderGeoJSON();
}
$('btn-undo').onclick=()=>{ if (history.length<=1) return; const cur=history.pop(); future.push(cur); loadFrom(history[history.length-1]); };
$('btn-redo').onclick=()=>{ if (!future.length) return; const next=future.pop(); history.push(next); loadFrom(next); };

// ------- GeoJSON helpers -------
function exportGeoJSON(){ return drawn.toGeoJSON(); }
function renderGeoJSON(){ $('geojson').textContent = JSON.stringify(exportGeoJSON(), null, 2); }

// ------- Selection + metrics + buffer (Turf) -------
function attachSelectable(layer){ layer.on('click', ()=> setSelected(layer)); }
function setSelected(layer){
  selectedLayer=layer;
  drawn.eachLayer(l => l.setStyle && l.setStyle({ weight: 2 }));
  if (layer?.setStyle) layer.setStyle({ weight: 4 });
  updateMetrics(layer);
}
function setMetricsText(text){ $('metrics').textContent = text; }
function updateMetrics(layer){
  if (!layer){ setMetricsText('–'); return; }
  const gj = layer.toGeoJSON();
  let txt='';
  if (/Polygon/.test(gj.geometry.type)){
    const m2 = turf.area(gj); const km2 = m2/1_000_000;
    txt = `Area: ${km2.toFixed(3)} km² (${Math.round(m2).toLocaleString()} m²)`;
  } else if (/LineString/.test(gj.geometry.type)){
    const km = turf.length(gj, { units:'kilometers' });
    txt = `Length: ${km.toFixed(3)} km`;
  } else if (/Point/.test(gj.geometry.type)){
    txt = 'Point(s)';
  } else { txt = gj.geometry.type; }
  setMetricsText(txt);
}
$('btn-buffer').onclick = () => {
  const distM = parseFloat($('buffer-m').value);
  if (!selectedLayer) return alert('Select a shape first (click it).');
  if (!(distM>0)) return alert('Enter buffer distance (meters).');
  const gj = selectedLayer.toGeoJSON();
  const buffered = turf.buffer(gj, distM/1000, { units:'kilometers' });
  const buffLayer = L.geoJSON(buffered,{ style:{ color:'#ff8800' } }).addTo(drawn);
  buffLayer.eachLayer(l => { try{ l.pm.enable(); }catch(e){} attachSelectable(l); });
  setSelected(buffLayer.getLayers ? buffLayer.getLayers()[0] : buffLayer);
  snapshot(); renderGeoJSON();
};

// ------- Nominatim (in-toolbar) -------
const searchInput=$('search-input'); const searchBtn=$('btn-search'); const resultsBox=$('search-results');
searchBtn.onclick=runSearch; searchInput.addEventListener('keydown',e=>{ if(e.key==='Enter') runSearch(); });
async function runSearch(){
  const q=(searchInput.value||'').trim();
  if(!q){ resultsBox.classList.remove('show'); resultsBox.innerHTML=''; return; }
  resultsBox.innerHTML='<div class="item">Searching…</div>'; resultsBox.classList.add('show');
  try{
    const url=new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q',q); url.searchParams.set('format','json');
    url.searchParams.set('addressdetails','1'); url.searchParams.set('limit','8');
    const res=await fetch(url.toString(),{headers:{'Accept':'application/json'}}); const data=await res.json();
    if(!Array.isArray(data)||!data.length){ resultsBox.innerHTML='<div class="item">No results</div>'; return; }
    resultsBox.innerHTML=data.map(r=>`<div class="item" data-id="${r.place_id}">${r.display_name}</div>`).join('');
    Array.from(resultsBox.querySelectorAll('.item')).forEach((el,idx)=>{ el.addEventListener('click',()=>goToResult(data[idx])); });
  }catch(e){ resultsBox.innerHTML='<div class="item">Search failed</div>'; }
}
function goToResult(item){
  resultsBox.classList.remove('show'); resultsBox.innerHTML='';
  if(item.boundingbox){ const [s,n,w,e]=item.boundingbox.map(parseFloat); const b=L.latLngBounds([[s,w],[n,e]]); map.fitBounds(b.pad(0.08)); }
  else if(item.lat&&item.lon){ map.flyTo([parseFloat(item.lat), parseFloat(item.lon)],15); }
}

// ------- Init -------
snapshot(); renderGeoJSON();
