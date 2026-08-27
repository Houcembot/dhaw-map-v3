// ===== APP PRINCIPAL — MapLibre GL + Scrollytelling minimal ====
// Généré 2026-08-27 pour dhaw-map.pages.dev v2 (corrigé)

let map, graceSource, playing = false, playTimer = null;

async function init() {
  // MapLibre GL
  map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
      sources: {
        'cartodb': {
          type: 'raster',
          tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors, © CARTO'
        }
      },
      layers: [
        {id: 'background', type: 'background', paint: {'background-color': '#0b1017'}},
        {id: 'cartodb-layer', type: 'raster', source: 'cartodb', paint: {'raster-opacity': 0.6}}
      ]
    },
    center: [9.6, 34.2],
    zoom: 5.8,
    minZoom: 4.5,
    maxZoom: 13,
    pitch: 0,
    bearing: 0,
    attributionControl: false
  });

  map.addControl(new maplibregl.AttributionControl({compact: true}), 'bottom-right');

  // Attendre le style chargé
  map.on('load', () => {
    console.log('Map load event fired');
    addOsmSource();
    console.log('addOsmSource done');
    addPluieBarrages();
    console.log('addPluieBarrages done');
    addMarques();
    console.log('addMarques done');
    addDessalement();
    console.log('addDessalement done');
    addNappes();
    console.log('addNappes done');
    addGrace();
    console.log('addGrace done');
    setupLayersUI();
    console.log('setupLayersUI done');
    renderFacts();
    console.log('renderFacts done');
    setupTimebar();
    console.log('setupTimebar done');
    setupLang();
    console.log('setupLang done');
    setupPopups();
    console.log('setupPopups done');
  });
}

// --- OSM vector tiles (côtées + pays) ---
function addOsmSource() {
  // Fond CARTO déjà chargé, rien à faire
}

// --- Pluie & barrages (points dimensionnés par capacité) ---
function addPluieBarrages() {
  map.addSource('barrages', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: BARRAGES.map(function(b) {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [b.lon, b.lat]
          },
          properties: {
            nom: b.nom,
            cap: b.cap,
            gouv: b.gouv,
            capNote: b.capNote || '',
            pluie: PLUIE[b.nom] ? PLUIE[b.nom].pluie : undefined,
            et0moy: PLUIE[b.nom] ? PLUIE[b.nom].et0moy : undefined
          }
        };
      })
    }
  });

  // Cercles capacité
  map.addLayer({
    id: 'barrages-cap',
    type: 'circle',
    source: 'barrages',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'cap'], 20, 5, 800, 18],
      'circle-color': '#38bdf8',
      'circle-opacity': 0.85,
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#0b1017'
    }
  });

  // Labels
  map.addLayer({
    id: 'barrages-label',
    type: 'symbol',
    source: 'barrages',
    layout: {
      'text-field': ['concat', ['get', 'nom'], '\n', ['number-format', ['get', 'cap'], {}], ' Mm³'],
      'text-font': ['Noto Sans Arabic Regular', 'Open Sans Regular'],
      'text-size': 10,
      'text-offset': [0, 1.2],
      'text-anchor': 'top',
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#e2e9f1',
      'text-halo-color': '#0b1017',
      'text-halo-width': 2
    }
  });

  // Surfaces Sidi Salem (time-enabled)
  map.addSource('salem-surface', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: Object.entries(SALEM_SURFACE).map(function([yr, d]) {
        return {
          type: 'Feature',
          properties: {
            year: parseInt(yr),
            km2: d.km2,
            pct: d.pct,
            date: d.date
          },
          geometry: {
            type: 'Point',
            coordinates: [9.1667, 36.4833]
          }
        };
      })
    }
  });

  map.addLayer({
    id: 'salem-surface-circle',
    type: 'circle',
    source: 'salem-surface',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'pct'], 0, 8, 40, 22],
      'circle-color': ['interpolate', ['linear'], ['get', 'pct'], 0, '#f87171', 20, '#fbbf24', 35, '#34d399'],
      'circle-opacity': 0.7,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff'
    }
  });

  map.addLayer({
    id: 'salem-surface-label',
    type: 'symbol',
    source: 'salem-surface',
    layout: {
      'text-field': '{pct}%',
      'text-font': ['Open Sans Bold'],
      'text-size': 11,
      'text-offset': [0, -1.5]
    },
    paint: {
      'text-color': '#fff',
      'text-halo-color': '#0b1017',
      'text-halo-width': 2
    }
  });
}

// --- Marques d'eau en bouteille ---
function addMarques() {
  map.addSource('marques', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: MARQUES.map(function(m) {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [m.lon, m.lat]
          },
          properties: {
            nom: m.nom,
            grp: m.grp,
            src: m.src,
            approx: m.approx || false,
            sass: m.sass || false
          }
        };
      })
    }
  });

  map.addLayer({
    id: 'marques-circle',
    type: 'circle',
    source: 'marques',
    paint: {
      'circle-radius': 7,
      'circle-color': ['match', ['get', 'grp'], 'SFBT', '#c084fc', 'Rayan', '#fbbf24', '#38bdf8'],
      'circle-opacity': 0.9,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff'
    }
  });

  map.addLayer({
    id: 'marques-label',
    type: 'symbol',
    source: 'marques',
    layout: {
      'text-field': '{nom}',
      'text-font': ['Open Sans Regular'],
      'text-size': 9,
      'text-offset': [0, 1.3],
      'text-anchor': 'top',
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#e2e9f1',
      'text-halo-color': '#0b1017',
      'text-halo-width': 1.5
    }
  });
}

// --- Dessalement ---
function addDessalement() {
  console.log('addDessalem called');
  map.addSource('dessalem', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: DESSALEMENT.map(function(d) {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [d.lon, d.lat]
          },
          properties: {
            nom: d.nom
          }
        };
      })
    }
  });
  console.log('dessalem source added');

  map.addLayer({
    id: 'dessalem-icon',
    type: 'circle',
    source: 'dessalem',
    paint: {
      'circle-radius': 8,
      'circle-color': '#c084fc',
      'circle-opacity': 0.9,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff'
    }
  });
  console.log('dessalem-icon layer added');
}

// --- Nappes (polygones SASS + Djeffara) ---
function addNappes() {
  map.addSource('nappes', {
    type: 'geojson',
    data: NAPPES_GEOJSON
  });

  map.addLayer({
    id: 'nappes-fill',
    type: 'fill',
    source: 'nappes',
    paint: {
      'fill-color': '#f87171',
      'fill-opacity': 0.12,
      'fill-outline-color': '#f87171'
    }
  });

  map.addLayer({
    id: 'nappes-line',
    type: 'line',
    source: 'nappes',
    paint: {
      'line-color': '#f87171',
      'line-width': 2,
      'line-dasharray': [6, 4]
    }
  });

  map.addLayer({
    id: 'nappes-label',
    type: 'symbol',
    source: 'nappes',
    layout: {
      'text-field': '{n}',
      'text-font': ['Open Sans Bold'],
      'text-size': 10,
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#f87171',
      'text-halo-color': '#0b1017',
      'text-halo-width': 2
    }
  });
}

// --- GRACE time series (choropleth sur Tunisie) ---
function addGrace() {
  // Add GeoJSON source
  map.addSource('grace', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {name: 'Tunisie', anomaly: 0},
        geometry: {
          type: 'Polygon',
          coordinates: [[[7.5,30],[11.5,30],[11.5,37.5],[7.5,37.5],[7.5,30]]]
        }
      }]
    }
  });

  map.addLayer({
    id: 'grace-fill',
    type: 'fill',
    source: 'grace',
    paint: {
      'fill-color': ['interpolate', ['linear'], ['get', 'anomaly'], -20, '#f87171', -10, '#fbbf24', 0, '#34d399', 5, '#38bdf8'],
      'fill-opacity': 0.25
    }
  });
}

function updateGraceYear(year) {
  const anom = GRACE.anomalies[year] || 0;
  map.getSource('grace').setData({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {name: 'Tunisie', anomaly: anom, year: year},
      geometry: {
        type: 'Polygon',
        coordinates: [[[7.5,30],[11.5,30],[11.5,37.5],[7.5,37.5],[7.5,30]]]
      }
    }]
  });
  document.getElementById('cur-year').textContent = year;
  document.getElementById('grace-val').textContent = (anom >= 0 ? '+' : '') + anom + ' cm';
}

// --- UI: Calques ---
function setupLayersUI() {
  const toggles = {
    'l-pluie': ['barrages-cap', 'barrages-label', 'salem-surface-circle', 'salem-surface-label'],
    'l-barrages': ['barrages-cap', 'barrages-label'],
    'l-marques': ['marques-circle', 'marques-label'],
    'l-dessalem': ['dessalem-icon'],
    'l-nappes': ['nappes-fill', 'nappes-line', 'nappes-label']
  };
  Object.entries(toggles).forEach(function([chkId, layerIds]) {
    const el = document.getElementById(chkId);
    if (!el) return;
    el.addEventListener('change', function() {
      layerIds.forEach(function(id) {
        map.setLayoutProperty(id, el.checked ? 'visible' : 'none');
      });
    });
  });
}

// --- UI: Faits révélateurs ---
function renderFacts() {
  const cont = document.getElementById('facts');
  cont.innerHTML = '';
  FACTS.forEach(function(f, i) {
    const div = document.createElement('div');
    div.className = 'fact';
    div.innerHTML = '' +
      '<div class="num ' + f.cls + '">' + f.num + '</div>' +
      '<div class="lbl">' + f.lbl + '</div>' +
      '<div class="src">Cliquer pour détails + sources →</div>' +
      '<div class="detail">' + f.detail + '</div>';
    div.addEventListener('click', function(e) {
      // ne pas fermer si on clique sur un lien
      if (e.target.tagName === 'A') return;
      div.classList.toggle('open');
      div.querySelector('.src').style.display = div.classList.contains('open') ? 'none' : 'block';
    });
    cont.appendChild(div);
  });
}

// --- UI: Slider temporel ---
function setupTimebar() {
  const slider = document.getElementById('slider-year');
  const playBtn = document.getElementById('btn-play');

  slider.addEventListener('input', function(e) {
    updateGraceYear(parseInt(e.target.value));
  });

  playBtn.addEventListener('click', function() {
    if (playing) {
      stopPlay();
    } else {
      startPlay();
    }
  });

  // Afficher le slider
  document.getElementById('timebar').classList.add('on');
}

function startPlay() {
  playing = true;
  document.getElementById('btn-play').textContent = '⏸';
  const slider = document.getElementById('slider-year');
  let year = parseInt(slider.value);
  playTimer = setInterval(function() {
    year++;
    if (year > 2026) year = 2004;
    slider.value = year;
    updateGraceYear(year);
  }, 600);
}

function stopPlay() {
  playing = false;
  document.getElementById('btn-play').textContent = '▶';
  clearInterval(playTimer);
}

// --- Popups sur hover/clic ---
function setupPopups() {
  const popup = new maplibregl.Popup({closeButton: false, closeOnClick: true});

  function showPopup(e, layer, props) {
    if (!e.features?.length) return;
    const f = e.features[0].properties;
    let html = '<div class="pp">';
    if (layer.startsWith('barrages')) {
      const p = PLUIE[f.nom] || {};
      html += '<b class="t">🏞️ ' + f.nom + '</b>';
      html += '<div class="row"><span class="k">Capacité :</span> ' + f.cap + ' Mm³' + (f.capNote ? ' (' + f.capNote + ')' : '') + '</div>';
      html += '<div class="row"><span class="k">Gouvernorat :</span> ' + f.gouv + '</div>';
      if (p.pluie) {
        const last = Object.entries(p.pluie).pop();
        html += '<div class="row"><span class="k">Pluie ' + last[0] + ' :</span> ' + last[1] + ' mm</div>';
        html += '<div class="row"><span class="k">Évapo. moy. :</span> ' + p.et0moy + ' mm/an</div>';
        if (f.nom === 'Sidi Salem') {
          html += '<div class="row"><span class="k">Surface 2019 :</span> 41 km² → 2026: 33 km² <span class="c-red">(-46%)</span></div>';
        }
      }
    } else if (layer === 'marques-circle' || layer === 'marques-label') {
      const c = GRP_COLORS[f.grp] || '#38bdf8';
      html += '<b class="t" style="color:' + c + '">🍾 ' + f.nom + '</b>';
      html += '<div class="row"><span class="k">Groupe :</span> <span style="color:' + c + '">' + GRP_NAMES[f.grp] + '</span></div>';
      html += '<div class="row"><span class="k">Source déclarée :</span> ' + f.src + '</div>';
      if (f.sass) html += '<div class="row c-red">⚠️ Puisée dans la nappe fossile SASS</div>';
      if (f.approx) html += '<div class="row c-amber">⚠️ Position approximative</div>';
    } else if (layer === 'dessalem-icon') {
      html += '<b class="t">🏭 ' + f.nom + '</b>';
      html += '<div class="row"><span class="k">Projet :</span> Usine de dessalement d\'eau de mer (planifiée MARHP 2017)</div>';
    } else if (layer === 'nappes-fill' || layer === 'nappes-line') {
      html += '<b class="t">💧 ' + f.n + '</b>';
      if (f.surexp) html += '<div class="row"><span class="k">Surexploitation :</span> <span class="c-red">' + f.surexp + ' recharge</span></div>';
    }
    html += '</div>';
    popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
  }

  const interactiveLayers = ['barrages-cap', 'marques-circle', 'dessalem-icon', 'nappes-fill'];
  interactiveLayers.forEach(function(id) {
    map.on('click', id, function(e) { showPopup(e, id, e.features[0].properties); });
    map.on('mouseenter', id, function() { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', id, function() { map.getCanvas().style.cursor = ''; popup.remove(); });
  });

  // Salem surface
  map.on('click', 'salem-surface-circle', function(e) {
    const f = e.features[0].properties;
    const html = '<div class="pp"><b class="t">🏞️ Sidi Salem — ' + f.year + '</b>' +
      '<div class="row"><span class="k">Surface d\'eau :</span> ' + f.km2 + ' km² (' + f.pct + '% du max)</div>' +
      '<div class="row"><span class="k">Date image :</span> ' + (f.date || 'Sentinel-2') + '</div>' +
      '<div class="row"><span class="k">Tendance :</span> <span class="c-red">−46% depuis 2019</span></div></div>';
    popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
  });
  map.on('mouseenter', 'salem-surface-circle', function() { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'salem-surface-circle', function() { map.getCanvas().style.cursor = ''; popup.remove(); });
}

// --- Langue FR/AR ---
function setupLang() {
  // Pour v1 : les textes sont en FR dans le HTML, l'AR sera ajouté via data-i18n
  // Bouton bascule à ajouter plus tard
}

// --- Lancer ---
document.addEventListener('DOMContentLoaded', init);