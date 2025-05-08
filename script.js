document.addEventListener("DOMContentLoaded", function () {
  const kantone = document.querySelectorAll("svg path");
  const zeitDropdown = document.getElementById("zeitwahl");
  const chooseText = document.getElementById("choose-text");
  const chooseArea = document.getElementById("choose-area");
  const titel = document.getElementById("seiten-titel");
  let gewaehlterKanton = null;

  // Koordinaten-Mapping für Kantone (erweiterbar)
  const kantonsKoordinaten = {
    ZH: { lat: 47.3769, lon: 8.5417 },  // Zürich
    VS: { lat: 46.2333, lon: 7.3667 },  // Sion
    BE: { lat: 46.9481, lon: 7.4474 },  // Bern
    // Weitere hinzufügen …
  };

  // Kanton klicken
  kantone.forEach((kanton) => {
    kanton.addEventListener("click", function () {
      kantone.forEach(k => k.classList.remove("selected"));
      this.classList.add("selected");
      gewaehlterKanton = this.id;

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

      // Uhrzeit-Index bestimmen
      const stunde = parseInt(zeit.split(":")[0], 10);
      const zeitIndex = data.hourly.time.findIndex(t => new Date(t).getHours() === stunde);

      if (zeitIndex === -1) {
        alert("Keine Daten für diese Uhrzeit gefunden.");
        return;
      }

      const ort = kantonId === "ZH" ? "Zürich" :
                  kantonId === "VS" ? "Sion" :
                  kantonId === "BE" ? "Bern" :
                  kantonId;
      const datum = new Date().toLocaleDateString("de-CH");

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
