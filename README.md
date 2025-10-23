# IG-Sistema_Solar
Sistema solar creado en THREE.js para la asignatura de Informatica Gráfica

Se empezará explicando que ha hecho dividiendo la documentación por fichero empleado

## Contenidos

1. Camera.js
2. Panel.js
3. Planet.js
4. Index.js

## 1. Camera.js

El primer fichero que se describirá será el relacionado con el movimiento de la cámara. El fichero cuenta con 2 funciones principales: 
- Mover la cámara con las teclas "w,a,s,d"
- Realizar una animación de zoom a cada planeta o luna seleccionados

Para poder realizar el movimiento de la cámara se hace uso de las funciones `onKeyUp()` y `onKeyDown()` que detectan la tecla pulsada para poder moverse en función de ella una cierta orientación

Para realizar el zoom, el objetivo es cambiar la posición de la cámara y de los controles de la misma (para poder rotar con el orbitCamera sobre el planeta seleccionado) Una vez se han cambiado las posición se va realizando el zoom progresivamente

## 2. Panel.js

Este fichero es únicamente para crear los paneles que sales como UI en la pantalla.

El primero que se desarroolla es el que contiene todos los planetas en la parte superior izquierda de la pantalla. Este panel consistirá en un botón por planeta al que al puslar el botón se realiza la acción de zoom previamente explicada al planeta seleccionado. Además de los botones por cada planeta del Sistema Solar, incluye 2 botones extras:
- El primero botón, llamado "Global", vuelve a la vista inicial del sistema
- El segundo, llamado "Unlock", desbloquea la cámara que estaba anclada en un planeta para que el usuario pueda seguir moviéndose libremente desde ese punto.000

El segundo panel se encuentra en la esquina superior derecha y se trata de un único botón encargado de controlar las órbitas. Este controla 3 posibles estados/opciones
  1. Sin órbitas
  2. Órbitas gris oscura
  3. Órbitas blancas

El tercer panel solo aparecerá al acercarse a algún planeta que tenga lunas. Este sera un panel hijo del primero en el que salgan las lunas de dicho planeta para poder hacer zoom a las mismas

## 3. Planet.js

El tercer fichero (y más importante) es el que controla la lógica de creación de los planetas, las lunas, la estrella y demás cuerpos celestiales.

Lo primero que cabe destacar es la utilización de un diccionario en el que se guardan intentando escalar los valores reales de cada planeta a esta simulación con sus lunas incluidas si este tuviera. A continuación un ejemplo de un elemento del diccionario:

´´´
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
´´´

Los valores que se guardan son:
- Planeta elegido
    - Tamaño del planeta
    - Distancia al sol
    - Textura del planeta
    - Textura de rugosidad
    - Velocidad de traslación
    - Velocidad de rotación
    - Radio 1 de la elipse
    - Radio 2 de la elipse
    - Lunas de dicho planeta
        - Tamaño de la luna
        - Distancia al planeta
        - Velocidad de traslación
        - Velocidad de rotación
        - Textura de la luna
        - Posición en el array de lunas
