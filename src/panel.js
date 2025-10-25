import { activateZoom, zoomState, planetState } from "./camera.js";
import * as THREE from "three";

let orbitsVisible = true; // estado inicial
let orbitState = 2;
export function createPanel(
  camera,
  camcontrols,
  planetsInfo,
  planets,
  moons,
  orbitLines,
  ship
) {
  const global = document.getElementById("global");
  global.addEventListener("click", () => {
    planetState.planeta_centrado = null;
    camera.position.set(0, 2, 30);
    camcontrols.target.set(0, 0, 0);
    camcontrols.update();

    // Oculta también el subpanel de lunas
    const moonPanel = document.getElementById("moonPanel");
    if (moonPanel) moonPanel.classList.remove("show");
  });

  const btnShip = document.getElementById("ship");
  btnShip.classList.add("btn");
  btnShip.onclick = () => {
    planetState.planeta_centrado = ship;
    activateZoom(5); // zoom más suave
  };

  const desanclar = document.getElementById("desanclar");
  desanclar.addEventListener("click", () => {
    planetState.planeta_centrado = null;
  });

  const toggleButton = document.getElementById("togglePanel");
  toggleButton.addEventListener("click", () => {
    panel.classList.toggle("show");

    // Cambiar la flecha del botón
    if (panel.classList.contains("show")) {
      toggleButton.textContent = "Planetas ▲";
    } else {
      updateMoonPanel(planetsInfo, null, moonPanel, moons);
      toggleButton.textContent = "Planetas ▼";
    }
  });

  const toggleHelpButton = document.getElementById("help");
  toggleHelpButton.addEventListener("click", () => {
    helpPanel.classList.toggle("notshow");
  });

  const toggleOrbits = document.getElementById("toggleOrbits");
  toggleOrbits.onclick = () => {
    orbitState = (orbitState + 1) % 3;
    orbitLines.forEach((orbit) => {
      switch (orbitState) {
        case 0:
          toggleOrbits.textContent = "Activate white orbits";
          orbit.visible = false;
          break;

        case 1:
          toggleOrbits.textContent = "Activate gray orbits";
          orbit.visible = true;
          orbit.material.color.set(0xffffff);
          break;

        case 2:
          toggleOrbits.textContent = "Deactivate white orbits";
          orbit.visible = true;
          orbit.material.color.set(0x333333); // gris oscuro
          break;
      }
    });
  };

  const panel = document.getElementById("controlesPlanetasDiv");
  const moonPanel = document.getElementById("moonPanel");
  const helpPanel = document.getElementById("helpPanel");

  for (let planeta in planetsInfo) {
    const btn = document.createElement("button");
    btn.textContent = planeta;
    btn.classList.add("btn");

    btn.onclick = () => {
      const index = Object.keys(planetsInfo).indexOf(planeta);
      planetState.planeta_centrado = planets[index];
      activateZoom(3);
      updateMoonPanel(planetsInfo, planeta, moonPanel, moons);
    };

    panel.appendChild(btn);
  }
}

function updateMoonPanel(planetsInfo, planeta, moonPanel, moons) {
  moonPanel.innerHTML = "";
  if (!planeta) return;
  const p = planetsInfo[planeta];
  const lunas = p.moons;
  console.log(lunas);
  if (Object.keys(lunas).length > 0) {
    moonPanel.classList.add("show");

    const title = document.createElement("div");
    title.textContent = "Satellites:";
    title.classList.add("moon-title");
    moonPanel.appendChild(title);

    for (let luna in lunas) {
      const btn = document.createElement("button");
      btn.textContent = luna;
      btn.classList.add("btn");
      btn.onclick = () => {
        const lunaMesh = lunas[luna].mesh;
        planetState.planeta_centrado = lunaMesh;
        activateZoom(13);
      };
      moonPanel.appendChild(btn);
    }
  } else {
    moonPanel.classList.remove("show");
  }
}
