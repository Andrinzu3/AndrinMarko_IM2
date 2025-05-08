document.addEventListener("DOMContentLoaded", function () {
  const kantone = document.querySelectorAll("svg path");
  const zeitDropdown = document.getElementById("zeitwahl");
  const chooseText = document.getElementById("choose-text");
  const chooseArea = document.getElementById("choose-area");
  const titel = document.getElementById("seiten-titel");
  let gewaehlterKanton = null;

  // Koordinaten-Mapping für Kantone (erweiterbar)
  const kantonsKoordinaten = {
    AG: { lat: 47.3906, lon: 8.0458 },    // Aarau
    AI: { lat: 47.3317, lon: 9.4306 },    // Appenzell
    AR: { lat: 47.3667, lon: 9.3000 },    // Herisau
    BE: { lat: 46.9481, lon: 7.4474 },    // Bern
    BL: { lat: 47.4667, lon: 7.6167 },    // Liestal
    BS: { lat: 47.5596, lon: 7.5886 },    // Basel
    FR: { lat: 46.8065, lon: 7.1610 },    // Freiburg
    GE: { lat: 46.2044, lon: 6.1432 },    // Genf
    GL: { lat: 47.0400, lon: 9.0680 },    // Glarus
    GR: { lat: 46.8508, lon: 9.5328 },    // Chur
    JU: { lat: 47.3667, lon: 7.3500 },    // Delémont
    LU: { lat: 47.0502, lon: 8.3093 },    // Luzern
    NE: { lat: 46.9930, lon: 6.9310 },    // Neuchâtel
    NW: { lat: 46.9583, lon: 8.3836 },    // Stans
    OW: { lat: 46.8750, lon: 8.2486 },    // Sarnen
    SG: { lat: 47.4245, lon: 9.3767 },    // St. Gallen
    SH: { lat: 47.6964, lon: 8.6349 },    // Schaffhausen
    SO: { lat: 47.2088, lon: 7.5370 },    // Solothurn
    SZ: { lat: 47.0200, lon: 8.6500 },    // Schwyz
    TG: { lat: 47.5667, lon: 9.2167 },    // Frauenfeld
    TI: { lat: 46.0101, lon: 8.9600 },    // Bellinzona
    UR: { lat: 46.8800, lon: 8.6440 },    // Altdorf
    VD: { lat: 46.5197, lon: 6.6333 },    // Lausanne
    VS: { lat: 46.2333, lon: 7.3667 },    // Sion
    ZG: { lat: 47.1667, lon: 8.5167 },    // Zug
    ZH: { lat: 47.3769, lon: 8.5417 }     // Zürich
  };
  

// Kanton klicken
kantone.forEach((kanton) => {
  kanton.addEventListener("click", function () {
    kantone.forEach(k => k.classList.remove("selected"));
    this.classList.add("selected");

    gewaehlterKanton = this.id.trim().toUpperCase(); // ← das reicht

    document.getElementById("zeitwahl-container").style.display = "block";

    if (zeitDropdown.value) {
      zeigeResultate(gewaehlterKanton, zeitDropdown.value);
    }
  });
});


  // Zeitwahl
  zeitDropdown.addEventListener("change", function () {
    if (gewaehlterKanton && this.value) {
      zeigeResultate(gewaehlterKanton, this.value);
    }
  });

  // Titel-Klick: zurück zur Startseite
  titel.addEventListener("click", function () {
    document.getElementById("resultat-ansicht").classList.add("hidden");
    if (chooseArea) chooseArea.style.display = "block";
    if (chooseText) chooseText.style.display = "block";
    document.getElementById("zeitwahl-container").style.display = "none";
    document.getElementById("karte-mini").innerHTML = "";

    const grosseKarte = document.querySelector("svg");
    if (grosseKarte) grosseKarte.style.display = "block";

    zeitDropdown.value = "";
    gewaehlterKanton = null;
    kantone.forEach(k => k.classList.remove("selected"));

    // Resultate zurücksetzen
    document.getElementById("resultat-zeitort").textContent = "";
    document.getElementById("resultat-uv").textContent = "";
    document.getElementById("resultat-alder").textContent = "";
    document.getElementById("resultat-birch").textContent = "";
    document.getElementById("resultat-gras").textContent = "";
  });

  // Resultate anzeigen mit API-Verbindung
  async function zeigeResultate(kantonId, zeit) {
    const koord = kantonsKoordinaten[kantonId];
    if (!koord) {
      alert("Koordinaten für diesen Kanton fehlen.");
      return;
    }

    const apiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${koord.lat}&longitude=${koord.lon}&hourly=uv_index,alder_pollen,birch_pollen,grass_pollen&timezone=Europe%2FBerlin&forecast_days=1`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const stunde = parseInt(zeit.split(":")[0], 10);
      const zeitIndex = data.hourly.time.findIndex(t => new Date(t).getHours() === stunde);

      if (zeitIndex === -1) {
        alert("Keine Daten für diese Uhrzeit gefunden.");
        return;
      }

      const kantonNamen = {
        AG: "Aargau",
        AI: "Appenzell Innerrhoden",
        AR: "Appenzell Ausserrhoden",
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
      };

      const ort = kantonNamen[kantonId] || "Unbekannt";

      // Aktuelles Datum erstellen
      const jetzt = new Date();
      const datum = `${jetzt.getDate().toString().padStart(2, "0")}.${(jetzt.getMonth() + 1).toString().padStart(2, "0")}.${jetzt.getFullYear()}`;

      document.getElementById("resultat-zeitort").textContent = `${zeit} / ${datum} ${ort}`;
      document.getElementById("resultat-uv").textContent = `UV Index: ${data.hourly.uv_index[zeitIndex]}`;
      document.getElementById("resultat-alder").textContent = `Alder Pollen: ${data.hourly.alder_pollen[zeitIndex]}`;
      document.getElementById("resultat-birch").textContent = `Birch Pollen: ${data.hourly.birch_pollen[zeitIndex]}`;
      document.getElementById("resultat-gras").textContent = `Gras Pollen: ${data.hourly.grass_pollen[zeitIndex]}`;

      // Karte klonen und verkleinert anzeigen
      const svgOriginal = document.querySelector("svg");
      const svgClone = svgOriginal.cloneNode(true);
      const karteMini = document.getElementById("karte-mini");
      karteMini.innerHTML = "";
      karteMini.appendChild(svgClone);

      if (chooseArea) chooseArea.style.display = "none";
      if (chooseText) chooseText.style.display = "none";
      document.getElementById("zeitwahl-container").style.display = "none";
      if (svgOriginal) svgOriginal.style.display = "none";

      document.getElementById("resultat-ansicht").classList.remove("hidden");

    } catch (err) {
      console.error("Fehler beim Abrufen der Daten:", err);
      alert("Daten konnten nicht geladen werden.");
    }
  }
});
