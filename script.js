// Pollen Animation Initialization
function initPollenDOM() {
  const container = document.getElementById('pollen-container');
  const count = 80;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('pollen');

    // Zufällige Größe (2–16px)
    const size = 2 + Math.random() * 14;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    // Zufällige horizontale Start-Position
    p.style.left = `${Math.random() * 100}vw`;

    // Animation-Dauer & Start-Delay
    const dur = 8 + Math.random() * 7;
    p.style.animationDuration = `${dur}s`;
    p.style.animationDelay = `${-Math.random() * dur}s`;

    // Horizontale Drift
    const dx = (Math.random() - 0.5) * 20;
    p.style.setProperty('--dx', `${dx}vw`);

    // Animationsname
    p.style.animationName = 'floatUp';

    container.appendChild(p);
  }
}

document.addEventListener('DOMContentLoaded', initPollenDOM);

// Pollenmenge aktualisieren
function aktualisierePollenmenge(intensitaet) {
  const container = document.getElementById('pollen-container');
  container.innerHTML = '';

  // Basisanzahl: 30–150, je nach Intensität
  const count = Math.min(200, Math.max(1, Math.round(intensitaet * 20)));

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('pollen');

    const size = 2 + Math.random() * 14;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}vw`;

    const dur = 8 + Math.random() * 7;
    p.style.animationDuration = `${dur}s`;
    p.style.animationDelay = `${-Math.random() * dur}s`;

    const dx = (Math.random() - 0.5) * 20;
    p.style.setProperty('--dx', `${dx}vw`);
    p.style.animationName = 'floatUp';

    container.appendChild(p);
  }
}

// Hauptskript
document.addEventListener('DOMContentLoaded', () => {
  console.log('Script geladen');

  const kantone = document.querySelectorAll('svg path');
  const zeitDropdown = document.getElementById('zeitwahl');
  const chooseText = document.getElementById('choose-text');
  const chooseArea = document.getElementById('choose-area');
  const titel = document.getElementById('seiten-titel');
  const kantonSelect = document.getElementById('kanton-select');
  const loader = document.getElementById('loader');
  const mini = document.getElementById('karte-mini');
  const container = document.getElementById('resultat-ansicht');

  let gewaehlterKanton = null;

  const kantonsKoordinaten = {
    AG: { lat: 47.3906, lon: 8.0458 },
    AI: { lat: 47.3317, lon: 9.4306 },
    AR: { lat: 47.3667, lon: 9.3    },
    BE: { lat: 46.9481, lon: 7.4474 },
    BL: { lat: 47.4667, lon: 7.6167 },
    BS: { lat: 47.5596, lon: 7.5886 },
    FR: { lat: 46.8065, lon: 7.161 },
    GE: { lat: 46.2044, lon: 6.1432 },
    GL: { lat: 47.04,   lon: 9.068 },
    GR: { lat: 46.8508, lon: 9.5328 },
    JU: { lat: 47.3667, lon: 7.35   },
    LU: { lat: 47.0502, lon: 8.3093 },
    NE: { lat: 46.993,  lon: 6.931  },
    NW: { lat: 46.9583, lon: 8.3836 },
    OW: { lat: 46.875,  lon: 8.2486 },
    SG: { lat: 47.4245, lon: 9.3767 },
    SH: { lat: 47.6964, lon: 8.6349 },
    SO: { lat: 47.2088, lon: 7.537  },
    SZ: { lat: 47.02,   lon: 8.65   },
    TG: { lat: 47.5667, lon: 9.2167 },
    TI: { lat: 46.0101, lon: 8.96   },
    UR: { lat: 46.88,   lon: 8.644  },
    VD: { lat: 46.5197, lon: 6.6333 },
    VS: { lat: 46.2333, lon: 7.3667 },
    ZG: { lat: 47.1667, lon: 8.5167 },
    ZH: { lat: 47.3769, lon: 8.5417 }
  };

  // Kanton auswählen
  kantone.forEach(k => {
    k.addEventListener('click', () => {
      console.log('🖱️ Kanton geklickt:', k.id);
      kantone.forEach(x => x.classList.remove('selected'));
      k.classList.add('selected');
      gewaehlterKanton = k.id.trim().toUpperCase();

       // === Zeit-Dropdown zurücksetzen ===
       zeitDropdown.selectedIndex = 0;

      if (window.innerWidth <= 600 && kantonSelect) {
        kantonSelect.value = gewaehlterKanton;
      }

      document.getElementById('zeitwahl-container').style.display = 'block';
      if (zeitDropdown.value) {
        zeigeResultate(gewaehlterKanton, zeitDropdown.value);
      }
    });
  });

  // Mobile Dropdown
  if (kantonSelect) {
    kantonSelect.addEventListener('change', () => {
      const iso = kantonSelect.value;
      if (!iso) return;

      kantone.forEach(p => p.classList.remove('selected'));
      document.getElementById(iso)?.classList.add('selected');
      gewaehlterKanton = iso;

      // === Zeit-Dropdown zurücksetzen ===
    zeitDropdown.selectedIndex = 0;

      document.getElementById('zeitwahl-container').style.display = 'block';
      if (zeitDropdown.value) {
        zeigeResultate(iso, zeitDropdown.value);
      }
    });
  }

  // Zeitwahl
  zeitDropdown.addEventListener('change', () => {
    console.log('Zeit gewählt:', zeitDropdown.value);
    if (gewaehlterKanton && zeitDropdown.value) {
      zeigeResultate(gewaehlterKanton, zeitDropdown.value);
    }
  });

   // === Kanton-Select zurücksetzen ===
  kantonSelect.selectedIndex = 0;                // springt zur ersten Platzhalter-Option
  gewaehlterKanton = null;                      // interne Variable leeren
  kantone.forEach(p => p.classList.remove('selected'));

  // Reset per Titel-Klick
  titel.addEventListener('click', () => window.location.reload());

  // Ergebnis anzeigen mit Loader & Animation
  async function zeigeResultate(kantonId, zeit) {
    document.getElementById('controls').classList.add('hidden');
    loader.classList.remove('hidden');
    loader.classList.add('visible');

    console.log('▶️ zeigeResultate start', kantonId, zeit);

    const koord = kantonsKoordinaten[kantonId];
    if (!koord) {
      alert('Koordinaten fehlen für ' + kantonId);
      loader.classList.replace('visible', 'hidden');
      return;
    }

    const apiUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality?` +
      `latitude=${koord.lat}&longitude=${koord.lon}` +
      `&hourly=uv_index,alder_pollen,birch_pollen,grass_pollen` +
      `&timezone=Europe%2FBerlin&forecast_days=1`;

    try {
      const resp = await fetch(apiUrl);
      const data = await resp.json();
      console.log('📡 API-Daten:', data.hourly.time.length, 'Stunden');

      const stunde = parseInt(zeit, 10);
      const idx = data.hourly.time.findIndex(t => new Date(t).getHours() === stunde);

      if (idx === -1) {
        alert('Keine Daten für ' + zeit);
        loader.classList.replace('visible', 'hidden');
        return;
      }

      const jetzt = new Date();
      const datum = `${String(jetzt.getDate()).padStart(2, '0')}` +
                    `.${String(jetzt.getMonth() + 1).padStart(2, '0')}` +
                    `.${jetzt.getFullYear()}`;

      const ortNameMap = {
  AG: 'Aarau',
  AI: 'Appenzell',
  AR: 'Herisau',
  BE: 'Bern',
  BL: 'Liestal',
  BS: 'Basel',
  FR: 'Fribourg',
  GE: 'Genf',
  GL: 'Glarus',
  GR: 'Chur',
  JU: 'Delémont',
  LU: 'Luzern',
  NE: 'Neuchâtel',
  NW: 'Stans',
  OW: 'Sarnen',
  SG: 'St. Gallen',
  SH: 'Schaffhausen',
  SO: 'Solothurn',
  SZ: 'Schwyz',
  TG: 'Frauenfeld',
  TI: 'Bellinzona',
  UR: 'Altdorf',
  VD: 'Lausanne',
  VS: 'Sion',
  ZG: 'Zug',
  ZH: 'Zürich'
};

      const ortName = ortNameMap[kantonId] || kantonId;

      const zeitFormatiert = new Date(data.hourly.time[idx]).toLocaleTimeString(
        'de-CH', { hour: '2-digit', minute: '2-digit' }
      );

      document.getElementById('resultat-zeitort').textContent = `${zeitFormatiert} / ${datum} ${ortName}`;
      document.getElementById('resultat-uv').textContent       = `UV Index: ${data.hourly.uv_index[idx]}`;
      document.getElementById('resultat-alder').textContent    = `Alder Pollen: ${data.hourly.alder_pollen[idx]}`;
      document.getElementById('resultat-birch').textContent    = `Birch Pollen: ${data.hourly.birch_pollen[idx]}`;
      document.getElementById('resultat-gras').textContent     = `Gras Pollen: ${data.hourly.grass_pollen[idx]}`;

      const alder = data.hourly.alder_pollen[idx] ?? 0;
      const birch = data.hourly.birch_pollen[idx] ?? 0;
      const grass = data.hourly.grass_pollen[idx] ?? 0;
      const pollenSumme = alder + birch + grass;
      console.log('Gesamtpollenwert:', pollenSumme);

      aktualisierePollenmenge(pollenSumme);

      // Mini-Karte klonen
      const svgOrig  = document.querySelector('svg');
      const svgClone = svgOrig.cloneNode(true);
      mini.innerHTML = '';
      mini.appendChild(svgClone);

      // UI umschalten
      [chooseArea, chooseText].forEach(el => el && (el.style.display = 'none'));
      document.getElementById('zeitwahl-container').style.display = 'none';
      svgOrig.style.display = 'none';

      container.classList.remove('hidden');
      const showAnimation = () => {
        container.classList.add('visible');
        document.getElementById('karte-mini').classList.add('visible');
      };
      requestAnimationFrame ? requestAnimationFrame(showAnimation) : setTimeout(showAnimation, 50);

    } catch (e) {
      console.error(e);
      alert('Fehler beim Laden der Daten');
    } finally {
      loader.classList.replace('visible', 'hidden');
    }
  }

  // Mobile Dropdown Sichtbarkeit
  const updateMobileDropdown = () => {
    if (window.innerWidth <= 600) kantonSelect?.classList.remove('hidden');
    else kantonSelect?.classList.add('hidden');
  };

  zeitDropdown?.addEventListener('change', updateMobileDropdown);
  updateMobileDropdown();
  window.addEventListener('resize', updateMobileDropdown);
});
