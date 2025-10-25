# IG-Sistema_Solar
Sistema solar creado en THREE.js para la asignatura de Informática Gráfica

Se empezará explicando qué se ha hecho. dividiendo la documentación por fichero empleado

## Contenidos

1. Camera.js
2. Panel.js
3. Planet.js
4. Index.js

## 1. Camera.js

El primer fichero que se describirá será el relacionado con el movimiento de la cámara. El fichero cuenta con dos funciones principales: 
- Mover la cámara con las teclas 'W, A, S, D'
- Realizar una animación de zoom a cada planeta o luna seleccionados

Para poder realizar el movimiento de la cámara se hace uso de las funciones `onKeyUp()` y `onKeyDown()` que detectan la tecla pulsada para poder moverse en función de ella y de la orientación actual.

Para realizar el zoom, el objetivo es cambiar la posición de la cámara y de los controles de la misma (para poder rotar con el orbitCamera sobre el planeta seleccionado) Una vez se han cambiado la posición se va realizando el zoom progresivamente

## 2. Panel.js

Este fichero es únicamente para crear los paneles que salen como interfaz de usuario (UI) en la pantalla.

El primero que se desarrolla es el que contiene todos los planetas en la parte superior izquierda de la pantalla. Este panel consistirá en un botón por planeta al que al pulsar el botón se realiza la acción de zoom previamente explicada al planeta seleccionado. Además de los botones por cada planeta del Sistema Solar, incluye dos botones extra:
- El primer botón, llamado "Global", vuelve a la vista inicial del sistema.
- El segundo, llamado "Unlock", desbloquea la cámara que estaba anclada en un planeta para que el usuario pueda seguir moviéndose libremente desde ese punto.

El segundo panel se encuentra en la esquina superior derecha y se trata de un único botón encargado de controlar las órbitas. Este controla 3 posibles estados/opciones:
  1. Sin órbitas
  2. Órbitas grises oscuras
  3. Órbitas blancas

El tercer panel solo aparecerá al acercarse a algún planeta que tenga lunas. Este será un panel hijo del primero en el que salgan las lunas de dicho planeta para poder hacer zoom a las mismas

También se crean dos botones extra, uno en la esquina inferior izquierda que provoca que siga a la nave creada que orbita el espacio y otro botón en la esquina inferior derecha que muestra un panel de ayuda para el usuario

## 3. Planet.js

El tercer fichero (y más importante) es el que controla la lógica de creación de los planetas, las lunas, la estrella y demás cuerpos celestiales.

Lo primero que cabe destacar es la utilización de un diccionario en el que se guardan intentando escalar los valores reales de cada planeta a esta simulación con sus lunas incluidas si este tuviera. A continuación un ejemplo de un elemento del diccionario:

```
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
```

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

A continuación se explicarán las distintas funciones para crear los astros:
  - createStar()
  - createPlanet()
  - createMoon()
  - CreateDefaultMoon()
  - CreateRing()
  - CreateAsteroidBelt()
  - UpdateAsteroidBelt()
  - createShip()

### createStar()

Función utilizada para crear el Sol en el centro del Sistema solar. Como elemento a destacar, se le añade una fuente de luz puntual en mitad del sol para que la aplique a todo el sistema

### createPlanet()

Como en la mayoría de estas funciones el primer paso es cargar la textura del planeta que se va a crear y a continuación se comprueba si tiene o no un mapa de rugosidad y en caso de tenerlo se le aplica. Además también comprueba si se trata de La Tierra para añadirle un mapa especular para detectar brillos en el mar, una textura de noche para las zonas en las que no le da el sol y una esfera de nubes por encima del propio planeta.
Lo siguiente es guardar algunas propiedades de la esfera que se usarán posteriormente como por ejemplo puede ser la velocidad de rotación, se añade la esfera a la escena y se procede a crear las órbitas del planeta.

### createMoon()

Muy parecida a la anterior, pero como punto diferente, se añade un pivote que marcará al planeta para saber sobre que objeto rotará la luna.

### createDefaultMoon()

Función que crea una luna pero lo hace con valores por defecto pues es la función que se usará al hacer clic sobre algún planeta para crear una luna en él

### createRing()

Crea los anillos que tendrán tanto Saturno como Urano. Se les añade una textura y un mapa alpha para calcular dónde están las transparencias en los anillos.
Hace uso de otra función createRingGeometry() a la que se le pasan los radios interno y externo para poder crear la geometría del anillo

### CreateAsteroidBelt()

Función que crea la geometría de un asteroide usando ` new THREE.IcosahedronGeometry()` para que no consuma muchos recursos del sistema y para que su forma sea aleatoria se deforma la geometría de manera aleatoria. Posteriormente, une todos los asteroides creados formando el cinturón de asteroides estableciendo el radio interior y exterior para indicar el grosor del cinturón. 

### UpdateAsteroidBelt()

Para cada asteroide se le añade una velocidad de rotación y traslación aleatoria y se actualiza en cada frame en el animationLoop().

### CreateShip()

Función que crea la nave que va rotando por el espacio. se divide en varios objetos:
- Un pivote que es donde se fija la cámara
- El cuerpo de la nave que es un cilindro
- La punta de la nave que es un cono
- Los cohetes que son dos cilindros
- Las alas que son dos cajas
- Una luz que sale desde el motor de la nave

## Index.js

Fichero principal de la aplicación. En la función `init()` se crea la escena, se crea la textura del espacio que es una esfera invertida que envuelve todo, se crea la cámara, la nave y los planetas, se añaden los paneles, los controles de la cámara, el sol, los anillos, los asteroides y la luz del sol.

En el `animationLoop()` que se ejecuta cada frame se calcula el movimiento de todos los objetos, sus rotaciones, sus velocidades y el movimiento de la cámara con su zoom.

También tiene la función encargada de al hacer clic en un planeta se cree automáticamente una luna de tamaño y en posición aleatorios.

