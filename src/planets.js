import * as THREE from "three";
import textureSun from "../textures/textureSun.jpg";
import textureMercury from "../textures/textureMercury.jpg";
import textureVenus from "../textures/textureVenus.jpg";
import textureEarth from "../textures/textureEarth.jpg";
import textureSpecularEarth from "../textures/textureSpecularEarth.jpg";
import textureEarthNight from "../textures/textureEarthNight.jpg";
import textureClouds from "../textures/textureClouds.png";
import textureMoon from "../textures/textureMoon.jpg";
import textureMars from "../textures/textureMars.jpg";
import texturePhobos from "../textures/texturePhobos.jpg";
import textureDeimos from "../textures/textureDeimos.jpg";
import textureJupiter from "../textures/textureJupiter.jpg";
import textureSaturn from "../textures/textureSaturn.jpg";
import textureUranus from "../textures/textureUranus.jpg";
import textureNeptune from "../textures/textureNeptune.jpg";
import textureBumpMercury from "../textures/Bump/textureBumpMercury.jpg";
import textureBumpVenus from "../textures/Bump/textureBumpVenus.jpg";
import textureBumpEarth from "../textures/Bump/textureBumpEarth.jpg";
import textureBumpMars from "../textures/Bump/textureBumpMars.jpg";

export let star,
  planets = [],
  moons = [];

export const orbitLines = [];

export const planetsInfo = {
  mercury: {
    size: 0.04,
    distance: 5,
    texture: textureMercury,
    textureBump: textureBumpMercury,
    Tspeed: 0.001,
    Rspeed: 0.001,
    f1: 1,
    f2: 0.987,
    axialTilt: 0.034,
    moons: {},
  },
  venus: {
    size: 0.06,
    distance: 10,
    texture: textureVenus,
    textureBump: textureBumpVenus,
    Tspeed: 0.0006,
    Rspeed: 0.0008,
    f1: 1,
    f2: 0.995,
    axialTilt: 2.64,
    moons: {},
  },
  earth: {
    size: 0.06,
    distance: 14,
    texture: textureEarth,
    textureBump: textureBumpEarth,
    Tspeed: 0.0005,
    Rspeed: 0.003,
    f1: 1,
    f2: 0.999,
    axialTilt: 0.409,
    moons: {
      moon: {
        size: 0.005,
        distance: 0.2,
        Tspeed: 0.0015,
        Rspeed: 0.005,
        texture: textureMoon,
        arrayPosition: 0,
      },
    },
  },
  mars: {
    size: 0.03,
    distance: 22,
    texture: textureMars,
    textureBump: textureBumpMars,
    Tspeed: 0.0001,
    Rspeed: 0.002,
    f1: 1,
    f2: 0.991,
    axialTilt: 0.439,
    moons: {
      phobos: {
        size: 0.01,
        distance: 0.4,
        Tspeed: 0.006,
        Rspeed: 0.005,
        texture: texturePhobos,
        arrayPosition: 1,
      },
      deimos: {
        size: 0.008,
        distance: 0.2,
        Tspeed: 0.004,
        Rspeed: 0.005,
        texture: textureDeimos,
        arrayPosition: 2,
      },
    },
  },
  jupiter: {
    size: 0.7,
    distance: 77,
    texture: textureJupiter,
    Tspeed: 0.00025,
    Rspeed: 0.01,
    axialTilt: 0.058,
    f1: 1,
    f2: 0.983,
    moons: [],
  },
  saturn: {
    size: 0.6,
    distance: 144,
    texture: textureSaturn,
    Tspeed: 0.0002,
    Rspeed: 0.005,
    axialTilt: 0.436,
    f1: 1,
    f2: 0.977,
    moons: {},
  },
  uranus: {
    size: 0.25,
    distance: 287,
    texture: textureUranus,
    Tspeed: 0.00025,
    Rspeed: 0.004,
    axialTilt: 1.138,
    f1: 1,
    f2: 0.998,
    moons: [],
  },
  neptune: {
    size: 0.24,
    distance: 449,
    texture: textureNeptune,
    Tspeed: 0.0002,
    Rspeed: 0.002,
    axialTilt: 0.405,
    f1: 1,
    f2: 0.999,
    moons: [],
  },
};

export function createStar(rad, col, scene) {
  // Cargar la textura
  const loader = new THREE.TextureLoader();
  const texture = loader.load(textureSun);

  // Crear la geometría
  const geometry = new THREE.SphereGeometry(rad, 32, 32);

  // Crear el material con la textura
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });

  // Crear el mesh
  star = new THREE.Mesh(geometry, material);

  // Añadir al escenario
  scene.add(star);

  const solarLight = new THREE.PointLight(0xffffff, 1, 0);
  solarLight.position.set(0, 0, 0);
  scene.add(solarLight);
}

export function createPlanet(
  radio,
  dist,
  Tspeed,
  Rspeed,
  texture,
  textureBump,
  scene,
  f1,
  f2,
  axialTilt,
  name
) {
  const loader = new THREE.TextureLoader();
  const textura = loader.load(texture);
  let materialConfig = { map: textura };

  if (textureBump) {
    const bump = loader.load(textureBump);
    materialConfig.bumpMap = bump;
    materialConfig.bumpScale = 0.005;
    if (name === "earth") {
      const nightMap = loader.load(textureEarthNight);
      const specularMap = loader.load(textureSpecularEarth);
      materialConfig.metalnessMap = specularMap;
      materialConfig.roughnessMap = specularMap;
      materialConfig.metalness = 1;
      materialConfig.roughness = 1;
      materialConfig.emissiveMap = nightMap;
      materialConfig.emissive = new THREE.Color(0xffffff);
      materialConfig.emissiveIntensity = 1;
    }
  }
  let mat = new THREE.MeshStandardMaterial(materialConfig);
  let geom = new THREE.SphereGeometry(radio, 30, 30);
  let planet = new THREE.Mesh(geom, mat);
  planet.userData.size = radio;
  planet.userData.dist = dist;
  planet.userData.Tspeed = Tspeed;
  planet.userData.Rspeed = Rspeed;
  planet.userData.f1 = f1;
  planet.userData.f2 = f2;
  planet.userData.axialTilt = axialTilt;
  planet.userData.orbitAngle = Math.random() * Math.PI * 2;

  if (name === "earth") {
    const cloudTexture = loader.load(textureClouds);
    const cloudGeom = new THREE.SphereGeometry(radio * 1.01, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    cloudMat.side = THREE.DoubleSide;

    const clouds = new THREE.Mesh(cloudGeom, cloudMat);
    planet.add(clouds);
    planet.userData.clouds = clouds;
  }

  planets.push(planet);
  scene.add(planet);

  //Dibuja trayectoria, con
  let curve = new THREE.EllipseCurve(
    0,
    0, // centro
    dist * f1,
    dist * f2 // radios elipse
  );

  // Crea puntos de la curva
  let points = curve.getPoints(50).map((p) => new THREE.Vector3(p.x, 0, p.y));
  let geome = new THREE.BufferGeometry().setFromPoints(points);
  let mate = new THREE.LineBasicMaterial({ color: 0x111111 });

  // Objeto línea
  let orbit = new THREE.Line(geome, mate);
  scene.add(orbit);
  orbit.visible = true;
  orbitLines.push(orbit);
  return planet;
}

export function createMoon(
  planet,
  radio,
  dist,
  Tspeed,
  Rspeed,
  texture,
  angle,
  moonDict,
  moonName
) {
  const pivot = new THREE.Object3D();
  pivot.rotation.x = angle;
  planet.add(pivot);

  const loader = new THREE.TextureLoader();
  const textura = loader.load(texture);
  const geom = new THREE.SphereGeometry(radio, 10, 10);
  const mat = new THREE.MeshStandardMaterial({ map: textura });
  const moon = new THREE.Mesh(geom, mat);

  moon.userData.dist = dist;
  moon.userData.Tspeed = Tspeed;
  moon.userData.Rspeed = Rspeed;

  moons.push(moon);
  pivot.add(moon);

  // Guardamos el mesh y el pivot en el diccionario para acceso directo
  moonDict[moonName] = {
    mesh: moon,
    pivot: pivot,
  };
}

export function createDefaultMoon(planet) {
  // Crear pivote de órbita
  const pivot = new THREE.Object3D();
  planet.add(pivot);

  const minFactor = 3;
  const maxFactor = 6;
  const dist =
    planet.userData.size *
    (minFactor + Math.random() * (maxFactor - minFactor));
  // Geometría y material
  const geom = new THREE.SphereGeometry(
    Math.random() * (planet.userData.size / 4),
    16,
    16
  );
  const mat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 1,
    metalness: 0,
  });
  const moon = new THREE.Mesh(geom, mat);

  // Valores por defecto
  moon.userData.dist = dist; // distancia del planeta
  moon.userData.Tspeed = 0.05 + Math.random() * 0.05; // velocidad orbital
  moon.userData.Rspeed = 0.05 + Math.random() * 0.05; // velocidad orbital
  moon.userData.angle = Math.random() * Math.PI * 2; // posición inicial
  pivot.rotation.x = (Math.random() - 0.5) * Math.PI; // entre -22.5° y +22.5°

  const tilt = (Math.random() - 0.5) * Math.PI; // entre -45° y +45°

  pivot.add(moon);
  moons.push(moon);
}

export function createRing(
  planet,
  innerRadius,
  outerRadius,
  texture,
  textureAlpha
) {
  const loader = new THREE.TextureLoader();
  const ringTexture = loader.load(texture);
  const alphaTexture = textureAlpha ? loader.load(textureAlpha) : null;

  const ringGeometry = createRingGeometry(innerRadius, outerRadius, 128);

  const material = new THREE.MeshStandardMaterial({
    map: ringTexture,
    alphaMap: alphaTexture,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    opacity: 0.8,
  });

  // Crear mesh
  const ring = new THREE.Mesh(ringGeometry, material);

  // Rotar para que quede horizontal
  ring.rotation.x = Math.PI / 2;

  // Añadir al planeta
  planet.add(ring);

  return ring;
}

function createRingGeometry(innerRadius, outerRadius, segments) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);

  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const radius = Math.sqrt(x * x + y * y);
    const t = (radius - innerRadius) / (outerRadius - innerRadius);
    uv.setXY(i, t, 1 - t);
  }

  uv.needsUpdate = true;
  return geometry;
}

export function createAsteroidBelt(scene, texture, count) {
  const baseGeometry = new THREE.IcosahedronGeometry(0.5, 1);
  const position = baseGeometry.attributes.position;
  const variation = 0.3;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const factor = 1 + (Math.random() - 0.5) * variation;
    position.setXYZ(i, x * factor, y * factor, z * factor);
  }
  position.needsUpdate = true;
  baseGeometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(texture),
    roughness: 1,
    metalness: 0,
  });

  const instancedMesh = new THREE.InstancedMesh(baseGeometry, material, count);
  instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // para actualizar posiciones
  scene.add(instancedMesh);

  const dummy = new THREE.Object3D();
  const data = [];

  const innerRadius = 40;
  const outerRadius = 60;
  const heightVariation = 3;

  for (let i = 0; i < count; i++) {
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * heightVariation;
    const scale = Math.random() * 0.05 + 0.08;

    dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    dummy.scale.set(scale, scale, scale);
    dummy.rotation.set(Math.random(), Math.random(), Math.random());
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    data.push({
      orbitAngle: angle,
      orbitRadius: radius,
      orbitSpeed: 0.0005 + Math.random() * 0.001,
      rotationSpeed: 0.001 + Math.random() * 0.002,
      y: y,
    });
  }

  return { instancedMesh, data, dummy };
}

export function updateAsteroidBelt({ instancedMesh, data, dummy }) {
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    d.orbitAngle += d.orbitSpeed;

    dummy.position.set(
      Math.cos(d.orbitAngle) * d.orbitRadius,
      d.y,
      Math.sin(d.orbitAngle) * d.orbitRadius
    );

    dummy.rotation.x += d.rotationSpeed;
    dummy.rotation.y += d.rotationSpeed * 0.5;
    dummy.updateMatrix();

    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
}

export function createShip(scene) {
  const pivotGeom = new THREE.SphereGeometry(0.05, 8, 8);
  const pivotMat = new THREE.MeshBasicMaterial({
    visible: false,
  });
  const pivot = new THREE.Mesh(pivotGeom, pivotMat);
  scene.add(pivot);

  const group = new THREE.Group();

  const bodyGeom = new THREE.CylinderGeometry(0.01, 0.015, 0.06, 16);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.8,
    roughness: 0.3,
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  group.add(body);

  const noseGeom = new THREE.ConeGeometry(0.01, 0.025, 16);
  const noseMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.9,
    roughness: 0.2,
  });
  const nose = new THREE.Mesh(noseGeom, noseMat);
  nose.position.y = 0.04;
  group.add(nose);

  const engineGeom = new THREE.CylinderGeometry(0.005, 0.007, 0.02, 8);
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  for (let i = -1; i <= 1; i += 2) {
    const engine = new THREE.Mesh(engineGeom, engineMat);
    engine.position.set(i * 0.008, -0.035, 0);
    group.add(engine);
  }

  const wingGeom = new THREE.BoxGeometry(0.03, 0.002, 0.1);
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const leftWing = new THREE.Mesh(wingGeom, wingMat);
  leftWing.position.set(-0.0005, 0, 0);
  const rightWing = leftWing.clone();
  rightWing.position.x *= -1;
  group.add(leftWing, rightWing);

  const engineLight = new THREE.PointLight(0x00aaff, 2, 3);
  engineLight.position.set(0, -0.04, 0);
  group.add(engineLight);

  pivot.add(group);

  pivot.userData.angle = 13;
  pivot.userData.speed = 0.00003;
  pivot.userData.radius = 10;

  return pivot;
}
