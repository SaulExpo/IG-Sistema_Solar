import * as THREE from "three";

const pressedKeys = {
  87: false,
  83: false,
  65: false,
  68: false,
};

export const zoomState = {
  zoomActivo: false,
  zoomProgress: 0,
  zoomStartPos: new THREE.Vector3(),
  zoomEndPos: new THREE.Vector3(),
  zoomCompletado: false,
};

export const planetState = {
  planeta_centrado: null,
};

export function activateZoom(factor) {
  zoomState.zoomActivo = true;
  zoomState.zoomProgress = 0;
  zoomState.offsetFactor = factor;
}

export function onKeyDown(e) {
  pressedKeys[e.keyCode] = true;
}

export function onKeyUp(e) {
  pressedKeys[e.keyCode] = false;
}

export function moveCamera(camera, camcontrols, ori) {
  const move = new THREE.Vector3();
  let speed = 0.01;
  // Movimiento
  if (pressedKeys[87]) {
    move.x += speed * Math.cos(ori);
    move.z += speed * Math.sin(ori);
  }
  if (pressedKeys[83]) {
    // S
    move.x -= speed * Math.cos(ori);
    move.z -= speed * Math.sin(ori);
  }
  if (pressedKeys[65]) {
    // A
    move.x += speed * Math.cos(ori - Math.PI / 2);
    move.z += speed * Math.sin(ori - Math.PI / 2);
  }
  if (pressedKeys[68]) {
    // D
    move.x -= speed * Math.cos(ori - Math.PI / 2);
    move.z -= speed * Math.sin(ori - Math.PI / 2);
  }

  camera.position.add(move);

  camcontrols.target.add(move);
  camcontrols.update();
}

export function startZoom(camera, camcontrols, planet, cameraPivot) {
  if (!planet) return;
  zoomState.zoomStartPos.copy(camera.position);
  planet.updateWorldMatrix(true, false);
  const worldPos = new THREE.Vector3();
  planet.getWorldPosition(worldPos);

  cameraPivot.position.copy(worldPos);

  const radius = planet.geometry.parameters.radius;
  const offset = radius * zoomState.offsetFactor;

  const endPos = new THREE.Vector3(
    worldPos.x + offset,
    worldPos.y + offset,
    worldPos.z + offset
  );

  if (zoomState.zoomActivo) {
    zoomState.zoomProgress += 0.02;
    if (zoomState.zoomProgress >= 1) {
      zoomState.zoomProgress = 1;
      zoomState.zoomActivo = false;
    }

    camera.position.lerpVectors(
      zoomState.zoomStartPos,
      endPos,
      zoomState.zoomProgress
    );
  } else {
    camera.position.copy(endPos);
  }

  camcontrols.target.copy(cameraPivot.position);
  camcontrols.update();
}
