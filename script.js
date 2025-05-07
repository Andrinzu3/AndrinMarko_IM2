document.addEventListener("DOMContentLoaded", function () {
    const kantone = document.querySelectorAll("svg path");
    const zeitDropdown = document.getElementById("zeitwahl");
    const chooseText = document.getElementById("choose-text");
    const chooseArea = document.getElementById("choose-area");
    const titel = document.getElementById("seiten-titel");
    let gewaehlterKanton = null;
  
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
  
    // Resultate anzeigen
    function zeigeResultate(kantonId, zeit) {
      const daten = {
        UV: 6,
        Alder: 4.0,
        Birch: 4.2,
        Gras: 4.2
      };
  
      const ort = kantonId === "ZH" ? "Zürich" :
                  kantonId === "VS" ? "Sion" : kantonId;
  
      const datum = new Date().toLocaleDateString("de-CH");
  
      document.getElementById("resultat-zeitort").textContent = `${zeit} / ${datum} ${ort}`;
      document.getElementById("resultat-uv").textContent = `UV Index: ${daten.UV}`;
      document.getElementById("resultat-alder").textContent = `Alder Pollen: ${daten.Alder}`;
      document.getElementById("resultat-birch").textContent = `Birch Pollen: ${daten.Birch}`;
      document.getElementById("resultat-gras").textContent = `Gras Pollen: ${daten.Gras}`;
  
      // Karte klonen und verkleinert anzeigen
      const svgOriginal = document.querySelector("svg");
      const svgClone = svgOriginal.cloneNode(true);
      const karteMini = document.getElementById("karte-mini");
      karteMini.innerHTML = "";
      karteMini.appendChild(svgClone);
  
      // Alles andere ausblenden
      if (chooseArea) chooseArea.style.display = "none";
      if (chooseText) chooseText.style.display = "none";
      document.getElementById("zeitwahl-container").style.display = "none";
      if (svgOriginal) svgOriginal.style.display = "none";
  
      document.getElementById("resultat-ansicht").classList.remove("hidden");
    }
  });
  