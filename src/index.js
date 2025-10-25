import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import textureSpace from "../textures/textureSpace.jpg";
import textureSaturnRing from "../textures/Rings/textureSaturnRing.jpg";
import textureSaturnRingTransparent from "../textures/Rings/textureSaturnRingTransparent.gif";
import textureUranusRing from "../textures/Rings/textureUranusRing.jpg";
import textureUranusRingTransparent from "../textures/Rings/textureUranusRingTransparent.gif";
import textureAsteroid from "../textures/textureNeptune.jpg";

import {
  onKeyDown,
  onKeyUp,
  moveCamera,
  startZoom,
  planetState,
  zoomState,
} from "./camera.js";
import {
  star,
  planets,
  moons,
  planetsInfo,
  createStar,
  createPlanet,
  createMoon,
  createDefaultMoon,
  createRing,
  createAsteroidBelt,
  updateAsteroidBelt,
  orbitLines,
  createShip,
} from "./planets.js";
import { createPanel } from "./panel.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let camera;
let cameraPivot;
let scene, renderer;
let ship;

let t0 = 0;
let accglobal = 0.001;
let timestamp;
let camcontrols;
let space;
let asteroids;
let ori = -Math.PI / 2;

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

init();
animationLoop();

function init() {
  //Defino cámara
  scene = new THREE.Scene();

  const loader = new THREE.TextureLoader();
  loader.load(textureSpace, (texture) => {
    const geo = new THREE.SphereGeometry(800, 100, 100); // esfera gigante
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });
    space = new THREE.Mesh(geo, mat);
    scene.add(space);
  });

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 30);
  cameraPivot = new THREE.Object3D();
  scene.add(cameraPivot);
  ship = createShip(scene);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camcontrols = new OrbitControls(camera, renderer.domElement);
  createPanel(
    camera,
    camcontrols,
    planetsInfo,
    planets,
    moons,
    orbitLines,
    ship
  );

  //Objetos
  createStar(2, 0xffff00, scene);
  let i = 0;
  for (let planeta in planetsInfo) {
    const p = planetsInfo[planeta];
    const planetMesh = createPlanet(
      p.size,
      p.distance,
      p.Tspeed,
      p.Rspeed,
      p.texture,
      p.textureBump,
      scene,
      p.f1,
      p.f2,
      p.axialTilt,
      planeta
    );
    if (planeta == "saturn") {
      createRing(
        planetMesh,
        0.65,
        1.2,
        textureSaturnRing,
        textureSaturnRingTransparent
      );
    }
    if (planeta == "uranus") {
      createRing(
        planetMesh,
        0.2,
        0.4,
        textureUranusRing,
        textureUranusRingTransparent
      );
    }
    for (let luna in p.moons) {
      const m = p.moons[luna];
      createMoon(
        planets[i],
        m.size,
        m.distance,
        m.Tspeed,
        m.Rspeed,
        m.texture,
        0.0,
        p.moons,
        luna
      );
    }
    i++;
  }
  asteroids = createAsteroidBelt(scene, textureAsteroid, 2000);

  //Inicio tiempo
  t0 = Date.now();
  //EsferaChild(objetos[0],3.0,0,0,0.8,10,10, 0x00ff00);

  const luzAmbiente = new THREE.AmbientLight(0x222222, 0.3); // color tenue
  scene.add(luzAmbiente);

  window.addEventListener("click", onClickAddMoon);
}

//Bucle de animación
function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;
  ori = Math.atan2(
    camcontrols.target.z - camera.position.z,
    camcontrols.target.x - camera.position.x
  );
  requestAnimationFrame(animationLoop);

  star.rotation.y += 0.001;
  //Modifica rotación de todos los objetos
  for (let object of planets) {
    object.position.x =
      Math.cos(
        object.userData.orbitAngle + timestamp * object.userData.Tspeed
      ) *
      object.userData.f1 *
      object.userData.dist;
    object.position.z =
      Math.sin(
        object.userData.orbitAngle + timestamp * object.userData.Tspeed
      ) *
      object.userData.f2 *
      object.userData.dist;
    if (object.userData.clouds) {
      object.userData.clouds.rotation.y += 0.002;
    }
    object.rotation.y += object.userData.Rspeed;
    object.rotation.x = object.userData.axialTilt;
  }

  for (let object of moons) {
    object.position.x =
      Math.cos(timestamp * object.userData.Tspeed) * object.userData.dist;
    object.position.z =
      Math.sin(timestamp * object.userData.Tspeed) * object.userData.dist;
    object.rotation.y += object.userData.Rspeed;
  }

  if (space) {
    space.rotation.x += 0.0003;
    space.rotation.y += 0.0001;
  }
  // Mover el pivot al planeta si hay uno centrado
  if (planetState.planeta_centrado) {
    planetState.planeta_centrado.updateWorldMatrix(true, false);
    const worldPos = new THREE.Vector3();
    planetState.planeta_centrado.getWorldPosition(worldPos);
    cameraPivot.position.copy(worldPos); // el pivot sigue al planeta
    camcontrols.target.copy(cameraPivot.position);
  }

  ship.userData.angle += ship.userData.speed;
  const r = ship.userData.radius;
  ship.position.set(
    Math.cos(ship.userData.angle) * r,
    Math.sin(ship.userData.angle * 0.5) * 10, // leve variación en altura
    Math.sin(ship.userData.angle) * r
  );

  // Que apunte hacia adelante en su órbita
  ship.lookAt(0, 0, 0);

  updateAsteroidBelt(asteroids);

  if (zoomState.zoomActivo) {
    startZoom(camera, camcontrols, planetState.planeta_centrado, cameraPivot);
  }

  moveCamera(camera, camcontrols, ori);
  camcontrols.update();
  renderer.render(scene, camera);
}

function onClickAddMoon(event) {
  // Convertir coordenadas del ratón a -1..1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Lanzar rayo desde cámara
  raycaster.setFromCamera(mouse, camera);

  // Intersectar con los planetas
  const intersects = raycaster.intersectObjects(planets, true);

  if (intersects.length > 0) {
    const planeta = intersects[0].object; // el planeta más cercano
    // Crear luna con valores por defecto
    createDefaultMoon(planeta);
  }
}
