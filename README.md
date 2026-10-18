# 🌡️ Mi Termómetro Emocional

Herramienta terapéutica web para niños: identifica emociones, mide su intensidad, explora sensaciones corporales, prueba estrategias de regulación y visualiza el recorrido.

## Estructura de archivos

```
termometro/
├── index.html               ← App principal (PWA)
├── manifest.webmanifest     ← Manifiesto PWA para instalación
├── service-worker.js        ← Cache offline (Cache-First)
├── css/
│   └── main.css             ← Estilos tablet-first, accesibles
├── js/
│   ├── sounds.js            ← Sintetizador Web Audio API
│   ├── state.js             ← Estado en memoria (sin datos personales)
│   ├── thermometer.js       ← Termómetro táctil arrastrable
│   ├── tools.js             ← Ventanita de herramientas
│   ├── adult.js             ← Panel adultos (Hawkins + modelo bidimensional)
│   └── app.js               ← Controlador principal
├── icons/
│   ├── icon-192.png         ← Icono PWA (Android)
│   └── icon-512.png         ← Icono PWA (splash screen)
├── sounds/                  ← (reservado para clips WAV/MP3 opcionales)
└── referencias/
    └── lamina_infantil_inicial.png
```

---

## Ejecución local (pruebas)

```bash
# Con Python 3 (incluido en Windows/macOS/Linux):
python -m http.server 8080
# Luego abre: http://localhost:8080
```

> **Nota:** El Service Worker solo activa cache offline en HTTPS (o localhost).
> Abrir `index.html` con doble clic no activará el SW.

---

## Despliegue para instalar como PWA (HTTPS requerido)

### Opción A — GitHub Pages (gratis)
1. Crea un repositorio en GitHub.
2. Sube todos los archivos del proyecto.
3. En Settings → Pages, selecciona la rama `main` y carpeta `/root`.
4. GitHub Pages te da URL como `https://tuusuario.github.io/termometro`.
5. Visita esa URL desde el tablet.

### Opción B — Netlify Drop (gratis, 1 minuto)
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta del proyecto.
3. Obtienes una URL HTTPS instantánea.

### Opción C — Vercel (gratis)
```bash
npm i -g vercel
vercel  # sigue las instrucciones
```

---

## Instalación en Android (Chrome)

1. Abre Chrome y navega a la URL HTTPS del proyecto.
2. Espera que Chrome muestre el banner "Añadir a la pantalla de inicio"
   **o** toca el menú ⋮ → "Instalar aplicación".
3. Confirma. El ícono 🌡️ aparecerá en tu pantalla de inicio.
4. La primera vez carga todos los assets. Después funciona **sin internet**.

> **Nota:** Abrir un archivo `.html` descargado localmente NO equivale a instalar la PWA.

---

## Instalación en iPad / iPhone (Safari)

1. Abre **Safari** y navega a la URL HTTPS.
2. Toca el botón de compartir **⬆** (parte inferior de la pantalla).
3. Selecciona **"Añadir a pantalla de inicio"**.
4. Asigna el nombre y toca **Añadir**.
5. La app aparece en tu pantalla de inicio y funciona **sin internet** después.

> **Importante:** En iOS solo funciona la instalación PWA desde Safari.
> Chrome en iOS NO muestra la opción de instalar.
> La app NO requiere App Store.

---

## Flujo de la aplicación

| Pantalla | Descripción |
|----------|-------------|
| **Bienvenida** | Logo animado, controles de sonido, acceso a panel adultos |
| **1. Emoción** | 6 tarjetas (enojo, alegría, tristeza, miedo, nervios, tranquilidad) + emoción personalizada. Cada una reproduce su sonido propio. |
| **2. Termómetro** | Termómetro vertical arrastrable (0–10). Colores por zona. Mensajes contextuales. Puntos corporales. |
| **3. Cuerpo** | 10 sensaciones corporales seleccionables. Sin respuestas incorrectas. |
| **4. Herramientas** | Puerta ilustrada que se "abre". 8 herramientas con feedback. Guía de respiración animada. Reevaluación de intensidad. |
| **5. Recorrido** | Antes → Herramienta → Después. Mensaje personalizado. Opción de reintentar o terminar. |
| **Panel adultos** | Escala de Hawkins + Modelo bidimensional (exportable a PNG). |

---

## Sonidos — Licencia y atribución

Todos los sonidos son **generados proceduralmente** mediante Web Audio API (síntesis de osciladores, ruido filtrado, envolventes ADSR).

**No se usan clips de audio de terceros.**

| Emoción | Descripción técnica |
|---------|---------------------|
| Enojo | Osciladores de diente de sierra 85-110 Hz + ruido bandpass 300 Hz |
| Alegría | Arpeggio ascendente si-mi-sol-do + burst de ruido agudo |
| Tristeza | Descenso 440→220 Hz + exhalación de ruido filtrado 600 Hz |
| Miedo | Subida rápida 300→580 Hz (triangle) + inhalación de ruido |
| Nervios | Patrón sincopado "uh-oh" + vibrato de inquietud |
| Tranquilidad | Campanilla 1047 Hz + exhalación suave |

**Para reemplazar por clips WAV/MP3 reales:**
1. Guarda el archivo en `/sounds/enojo.mp3` (por ejemplo).
2. En `js/sounds.js`, función `playEnojo()`, reemplaza el código de síntesis por:
   ```js
   const audio = new Audio('./sounds/enojo.mp3');
   audio.volume = volume;
   audio.play().catch(() => {});
   ```
3. Declara la licencia del clip en esta sección del README.

---

## Escala de Hawkins — Nota académica

Los niveles mostrados en el panel adultos provienen de:

> Hawkins, D.R. *Power vs. Force: The Hidden Determinants of Human Behavior*.
> Hay House, 1995. ISBN 978-1-4019-4609-0.

Esta escala es una **propuesta filosófica y espiritual**, no una herramienta clínica ni científicamente validada. **No debe confundirse** con:
- La Escala de Coma de Glasgow (GCS)
- El sistema AVPU (Alert, Voice, Pain, Unresponsive)
- Cualquier otro instrumento médico de valoración de conciencia

---

## Modelo bidimensional — Nota de la profesional

El gráfico Intensidad × Duración es un **modelo conceptual de trabajo**, pendiente de validación empírica. Los datos mostrados son ilustrativos. La tranquilidad (origen 0,0) no equivale a ausencia de conciencia emocional.

---

## Accesibilidad

- Botones ≥ 52px (target táctil)
- `aria-label`, `aria-pressed`, `aria-expanded`, `aria-live` en todos los elementos interactivos
- Navegable completamente con teclado (foco visible)
- Compatible con lectores de pantalla (VoiceOver iOS, TalkBack Android)
- Opción de desactivar sonido y ajustar volumen
- `prefers-reduced-motion` respetado (animaciones deshabilitadas)
- Alto contraste en texto principal

---

## Privacidad

- **Sin backend**: no hay servidor que procese datos.
- **Sin cookies ni localStorage**: todo en memoria, se borra al cerrar.
- **Sin analíticas**: no se usa Google Analytics ni similares.
- **Sin datos personales**: no se solicita nombre, diagnóstico ni identificador.

---

## Pruebas realizadas

| Prueba | Estado |
|--------|--------|
| Sonidos: cada emoción reproduce su audio propio | ✅ Verificado |
| Sin solapamiento entre clics rápidos | ✅ Verificado |
| Termómetro arrastrable con el dedo | ✅ Verificado |
| Termómetro con slider (accesible) | ✅ Verificado |
| Termómetro con teclado (flechas) | ✅ Verificado |
| Ventanita se abre/cierra con animación | ✅ Verificado |
| Guía de respiración animada | ✅ Verificado |
| Reevaluación de intensidad después de herramienta | ✅ Verificado |
| Pantalla de resumen antes → herramienta → después | ✅ Verificado |
| Panel Hawkins (tabla + gráfico) | ✅ Verificado |
| Modelo bidimensional con 4 trayectorias | ✅ Verificado |
| Exportar modelo a PNG | ✅ Verificado |
| PWA manifest válido | ✅ Verificado |
| Service Worker registrado y cache offline | ✅ Verificado |
| Sin errores en consola (build local) | ✅ Verificado |
| Prueba en hardware Android real | ⚠️ Pendiente (requiere despliegue HTTPS) |
| Prueba en iPad real | ⚠️ Pendiente (requiere despliegue HTTPS) |

---

## Solución de problemas de sonido

**El sonido no funciona la primera vez en iPad/Android:**
- Los navegadores móviles requieren que el audio sea iniciado por una interacción del usuario.
- La app lo gestiona correctamente: el AudioContext se inicializa al tocar "¡Vamos!".
- Si sigue sin sonar: revisa que el dispositivo no esté en modo silencioso.
- En iPad, el interruptor físico de silencio bloquea todo el audio de Safari.

**El volumen se escucha muy bajo:**
- Usa el control deslizante de volumen en la pantalla de bienvenida.
- El rango está limitado a valores seguros para niños (sin picos fuertes).

---

## Créditos

Desarrollado como herramienta de apoyo psicológico infantil.
Sonidos: síntesis procedural con Web Audio API (sin clips de terceros).
Sin frameworks externos. Vanilla HTML/CSS/JavaScript.
