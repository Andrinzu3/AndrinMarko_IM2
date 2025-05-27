function initPollenDOM() {
  const container = document.getElementById("pollen-container");
  const count = 80;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.classList.add("pollen");

    // zufällige Größe 2–6px
    const size = 2 + Math.random() * 14;
    p.style.width  = `${size}px`;
    p.style.height = `${size}px`;

    // zufällige horizontale Start-Position
    p.style.left = `${Math.random() * 100}vw`;

    // zufällige Animation-Dauer & Start-Delay
    const dur = 8 + Math.random() * 7;
    const delay = -Math.random() * dur;
    p.style.animationDuration = `${dur}s`;
    p.style.animationDelay = `${delay}s`;

    // horizontale Drift
    const dx = (Math.random() - 0.5) * 20;
    p.style.setProperty("--dx", `${dx}vw`);

    // Nur floatUp verwenden
    p.style.animationName = "floatUp";

    container.appendChild(p);
  }
}


// starte Pollen-Animation
document.addEventListener("DOMContentLoaded", initPollenDOM);

function aktualisierePollenmenge(intensitaet) {
  const container = document.getElementById("pollen-container");
  container.innerHTML = ""; // alte Pollen löschen

  // Basisanzahl: 30–150, je nach Belastung
  const count = Math.min(150, Math.max(30, Math.round(intensitaet * 10)));

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.classList.add("pollen");

    const size = 2 + Math.random() * 14;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    p.style.left = `${Math.random() * 100}vw`;

    const dur = 8 + Math.random() * 7;
    const delay = -Math.random() * dur;
    p.style.animationDuration = `${dur}s`;
    p.style.animationDelay = `${delay}s`;

    const dx = (Math.random() - 0.5) * 20;
    p.style.setProperty("--dx", `${dx}vw`);

    p.style.animationName = "floatUp";

    container.appendChild(p);
  }
}



document.addEventListener("DOMContentLoaded", () => {
  console.log(" Script geladen");
  

  const kantone        = document.querySelectorAll("svg path");
  const zeitDropdown   = document.getElementById("zeitwahl");
  const chooseText     = document.getElementById("choose-text");
  const chooseArea     = document.getElementById("choose-area");
  const titel          = document.getElementById("seiten-titel");
  const kantonSelect = document.getElementById("kanton-select");
  const loader = document.getElementById("loader");
  const mini     = document.getElementById("karte-mini");
   const container = document.getElementById("resultat-ansicht");
   
  let gewaehlterKanton = null;

  const kantonsKoordinaten = {
    AG: { lat: 47.3906, lon: 8.0458 },
    AI: { lat: 47.3317, lon: 9.4306 },
    AR: { lat: 47.3667, lon: 9.3000 },
    BE: { lat: 46.9481, lon: 7.4474 },
    BL: { lat: 47.4667, lon: 7.6167 },
    BS: { lat: 47.5596, lon: 7.5886 },
    FR: { lat: 46.8065, lon: 7.1610 },
    GE: { lat: 46.2044, lon: 6.1432 },
    GL: { lat: 47.0400, lon: 9.0680 },
    GR: { lat: 46.8508, lon: 9.5328 },
    JU: { lat: 47.3667, lon: 7.3500 },
    LU: { lat: 47.0502, lon: 8.3093 },
    NE: { lat: 46.9930, lon: 6.9310 },
    NW: { lat: 46.9583, lon: 8.3836 },
    OW: { lat: 46.8750, lon: 8.2486 },
    SG: { lat: 47.4245, lon: 9.3767 },
    SH: { lat: 47.6964, lon: 8.6349 },
    SO: { lat: 47.2088, lon: 7.5370 },
    SZ: { lat: 47.0200, lon: 8.6500 },
    TG: { lat: 47.5667, lon: 9.2167 },
    TI: { lat: 46.0101, lon: 8.9600 },
    UR: { lat: 46.8800, lon: 8.6440 },
    VD: { lat: 46.5197, lon: 6.6333 },
    VS: { lat: 46.2333, lon: 7.3667 },
    ZG: { lat: 47.1667, lon: 8.5167 },
    ZH: { lat: 47.3769, lon: 8.5417 }
  };

  // Klick auf Kanton
  kantone.forEach(k => k.addEventListener("click", () => {
    console.log("🖱️ Kanton geklickt:", k.id);
    kantone.forEach(x => x.classList.remove("selected"));
    k.classList.add("selected");
    gewaehlterKanton = k.id.trim().toUpperCase();
      // 👉 Dropdown aktualisieren, aber nur auf Mobile
  if (window.innerWidth <= 500 && kantonSelect) {
    kantonSelect.value = gewaehlterKanton;
  }

    document.getElementById("zeitwahl-container").style.display = "block";
    if (zeitDropdown.value) {
      zeigeResultate(gewaehlterKanton, zeitDropdown.value);
    }
  }));
// **Hier einfügen: Smartphone-Dropdown**
  
  
  if (kantonSelect) {
    kantonSelect.addEventListener("change", () => {
      const iso = kantonSelect.value;
      if (!iso) return;
      // 1) Karte markieren
      kantone.forEach(p => p.classList.remove("selected"));
      document.getElementById(iso)?.classList.add("selected");
      gewaehlterKanton = iso;
      // 2) Zeit-Select anzeigen
      document.getElementById("zeitwahl-container").style.display = "block";
      // 3) ggf. sofort Daten laden
      if (zeitDropdown.value) {
        zeigeResultate(iso, zeitDropdown.value);
      }
    });
  }
  

  // Auswahl der Zeit
  zeitDropdown.addEventListener("change", function () {
    console.log("⏰ Zeit gewählt:", this.value);
    if (gewaehlterKanton && this.value) {
      zeigeResultate(gewaehlterKanton, this.value);
    }
  });

  // Reset per Titel-Klick: Seite neu laden
  titel.addEventListener("click", () => {
    window.location.reload();
  });


  // ---------- Hauptfunktion mit Loader & Animation ----------
  async function zeigeResultate(kantonId, zeit) {
    // 1) Loader holen und einblenden
    document.getElementById("controls").classList.add("hidden");
    
    loader.classList.remove("hidden");
    
    loader.classList.add("visible");

    console.log("▶️ zeigeResultate start", kantonId, zeit);

    // 2) Koordinaten prüfen
    const koord = kantonsKoordinaten[kantonId];
    if (!koord) {
      alert("Koordinaten fehlen für " + kantonId);
      // Loader sofort wieder ausblenden
      loader.classList.remove("visible");
      loader.classList.add("hidden");
      return;
    }

    // 3) API-URL bauen
    const apiUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality?` +
      `latitude=${koord.lat}` +
      `&longitude=${koord.lon}` +
      `&hourly=uv_index,alder_pollen,birch_pollen,grass_pollen` +
      `&timezone=Europe%2FBerlin` +
      `&forecast_days=1`;

    try {
      // 4) Daten abrufen
      const resp = await fetch(apiUrl);
      const data = await resp.json();
      console.log("📡 API-Daten:", data.hourly.time.length, "Stunden");

      // 5) Index für die gewählte Stunde finden
      const stunde = parseInt(zeit, 10);
      const idx = data.hourly.time
        .findIndex(t => new Date(t).getHours() === stunde);

      if (idx === -1) {
        alert("Keine Daten für " + zeit);
        // Loader verstecken bevor wir abbrechen
        loader.classList.remove("visible");
        loader.classList.add("hidden");
        return;
      }

      // 6) Texte updaten
      const jetzt  = new Date();
      const datum  = `${String(jetzt.getDate()).padStart(2,"0")}`
                   + `.${String(jetzt.getMonth()+1).padStart(2,"0")}`
                   + `.${jetzt.getFullYear()}`;
      const ortKurzel = kantonId;
    const ortName = {
  AG: "Aargau",
  AI: "Appenzell AI",
  AR: "Appenzell AR",
  BE: "Bern",
  BL: "Basel-Landschaft",
  BS: "Basel-Stadt",
  FR: "Freiburg",
  GE: "Genf",
  GL: "Glarus",
  GR: "Graubünden",
  JU: "Jura",
  LU: "Luzern",
  NE: "Neuenburg",
  NW: "Nidwalden",
  OW: "Obwalden",
  SG: "St. Gallen",
  SH: "Schaffhausen",
  SO: "Solothurn",
  SZ: "Schwyz",
  TG: "Thurgau",
  TI: "Tessin",
  UR: "Uri",
  VD: "Waadt",
  VS: "Wallis",
  ZG: "Zug",
  ZH: "Zürich"
}[kantonId] || kantonId;


// Zeit Formatierung
const zeitFormatiert = new Date(data.hourly.time[idx]).toLocaleTimeString("de-CH", {
  hour: "2-digit",
  minute: "2-digit"
});

      document.getElementById("resultat-zeitort").textContent = `${zeitFormatiert} / ${datum} ${ortName}`;
      document.getElementById("resultat-uv").textContent      = `UV Index: ${data.hourly.uv_index[idx]}`;
      document.getElementById("resultat-alder").textContent   = `Alder Pollen: ${data.hourly.alder_pollen[idx]}`;
      document.getElementById("resultat-birch").textContent   = `Birch Pollen: ${data.hourly.birch_pollen[idx]}`;
      document.getElementById("resultat-gras").textContent    = `Gras Pollen: ${data.hourly.grass_pollen[idx]}`;

 
// Pollenwerte absichern
const alder = data.hourly.alder_pollen[idx] ?? 0;
const birch = data.hourly.birch_pollen[idx] ?? 0;
const grass = data.hourly.grass_pollen[idx] ?? 0;

const pollenSumme = alder + birch + grass;

console.log(" Gesamtpollenwert:", pollenSumme);

// Animation aktualisieren
aktualisierePollenmenge(pollenSumme);

      // 7) Mini-Karte klonen & anhängen
      const svgOrig  = document.querySelector("svg");
      const svgClone = svgOrig.cloneNode(true);
      
      mini.innerHTML = "";
      mini.appendChild(svgClone);

      // 8) UI umschalten
      [chooseArea, chooseText].forEach(el => el && (el.style.display="none"));
      document.getElementById("zeitwahl-container").style.display = "none";
      svgOrig.style.display = "none";

    





    // 9) Animation triggern
      
      container.classList.remove("hidden");
      requestAnimationFrame
        ? requestAnimationFrame(() => {
            container.classList.add("visible");
            document.getElementById("karte-mini").classList.add("visible");
          })
        : setTimeout(() => {
            container.classList.add("visible");
            document.getElementById("karte-mini").classList.add("visible");
          }, 50);
   

      // 10) Mobil-Dropdown verstecken
    

    } catch (e) {
      console.error(e);
      alert("Fehler beim Laden der Daten");
    } finally {
      loader.classList.remove("visible");
      loader.classList.add("hidden");
    }
  }


zeitDropdown?.addEventListener("change", () => {
  if (window.innerWidth <= 500 && kantonSelect) {
    kantonSelect.classList.add("hidden");
  }
});
// Dropdown bei Fenstergrösse initial korrekt setzen
if (window.innerWidth <= 500) {
  kantonSelect?.classList.remove("hidden");
} else {
  kantonSelect?.classList.add("hidden");
}

// Dynamisch auf Fenstergrösse reagieren
window.addEventListener("resize", () => {
  if (window.innerWidth <= 500) {
    kantonSelect?.classList.remove("hidden");
  } else {
    kantonSelect?.classList.add("hidden");
  }
});

 

}); // Ende DOMContentLoaded
