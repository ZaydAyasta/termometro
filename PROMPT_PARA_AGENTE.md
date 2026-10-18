# Encargo para agente de programación: Termómetro emocional terapéutico

Actúa como desarrollador frontend senior, diseñador de experiencias táctiles infantiles y colaborador técnico de una profesional que atiende a niños y orienta a sus familias. Debes **terminar y pulir** una aplicación web interactiva llamada «Mi termómetro emocional», partiendo de los archivos `index.html`, `styles.css` y `app.js` que adjunto. No la reemplaces por una maqueta ni te quedes en un plan: implementa, verifica y entrega algo realmente utilizable en una tablet.

## Contexto de la intervención

La profesional usa la metáfora de la **fiebre** para explicar las emociones. Cuando la «temperatura emocional» es baja, la sensación puede ser leve; cuando sube, puede haber cambios físicos notables y resultar más difícil autorregularse; con intensidades altas puede ser especialmente útil el acompañamiento de un adulto. El propósito NO es enseñar a reprimir emociones ni afirmar que sentir mucho sea malo. Los niños deben aprender a **identificar qué sienten, cuánto sienten, dónde lo sienten en su cuerpo, qué apoyo necesitan y cómo cambia esa experiencia con el tiempo**.

Además, la profesional maneja un **modelo conceptual propio** con **eje X = duración de una emoción**, **eje Y = intensidad de esa emoción** y **origen (0,0) = referencia de tranquilidad**. Es un recurso psicoeducativo y una hipótesis clínica que NO debe presentarse como modelo validado. Distingue cuidadosamente tranquilidad de conciencia emocional: es posible experimentar una emoción intensa y conservar conciencia de ella y capacidad de elección.

## Entregables obligatorios

1. Aplicación táctil terminada, responsive, en español claro para niños y sin anuncios.
2. Modo de instalación en **tablet Android (Chrome)** y **iPad (Safari)**. Preferir una **PWA estática instalable** con `manifest.webmanifest`, iconos y `service-worker.js` para uso sin conexión **después de la primera carga por HTTPS**. Indicar con claridad que en iPad se usa «Añadir a pantalla de inicio» y que abrir un HTML descargado no equivale necesariamente a instalar la aplicación. No inventar enlaces desplegados: documentar cómo publicar en alojamiento estático HTTPS.
3. Todos los sonidos, imágenes y fuentes necesarios deben estar dentro del proyecto o tener una licencia y atribución documentada que permita el uso previsto sin red. No depender de APIs pagadas.
4. Código mantenible, sin errores en consola, probando interacción táctil, teclado y lectores de pantalla básicos.
5. `README.md` con instrucciones de ejecución local, despliegue, instalación en ambas tabletas, solución de problemas del sonido y pruebas realizadas.

## Flujo para el niño

**Pantalla 1: Identifico mi emoción.** Tarjetas grandes con dibujos/rostros muy claros: 😠 enojo, 😄 alegría/felicidad, 😢 tristeza, 😨 miedo, 😬 nervios/ansiedad y una opción «otra emoción» (editable). Al tocar una tarjeta, se selecciona visualmente y **se reproduce un sonido corto y característico**. La elección debe poder cambiar sin reiniciar.

**Sonidos — requisito importante:**
- **Enojo:** un gruñidito suave «grrr», reconocible y no amenazante.
- **Alegría:** una risita breve y cálida o una exclamación feliz, reconocible.
- **Tristeza:** un suspiro o sollozo muy corto, sin resultar angustiante.
- **Miedo:** una inhalación sorprendida o «¡oh!» suave, no un grito.
- **Nervios:** un «uh-oh» discreto o titubeo corto; si es mejor, sonido suave representativo.
- **Calma/tranquilidad** (si se agrega): exhalación suave o campanilla muy tenue.

No basta con aplicar el mismo pitido a todas. El prototipo incluye sonidos **sintetizados de prueba** en `app.js`; reemplazarlos o complementarlos por clips expresivos auténticos **con licencia segura para uso** y guardados localmente. Si todavía no hay archivos de audio apropiados, mantener el sintetizador como *fallback*, declarar qué clips faltan y no afirmar que son voces reales. Duración orientativa 0,3–1,5 segundos; volumen bajo, sin sobresaltos, sin reproducción automática, sin bucles y evitando solapamientos entre clics rápidos. Añadir control accesible «Sonido: encendido/apagado» y control simple de volumen o niveles discreto. Respetar restricciones de reproducción iniciada por interacción del usuario en iPad/Android.

**Pantalla 2: Muevo mi termómetro.** Termómetro VERTICAL visual y de tamaño generoso, **manipulable directamente deslizando/tocando su escala del 0 al 10** (además de slider accesible). Indicador grande que sigue el dedo. Colores graduados, números legibles, nombre de zona y señal somática opcional. Rangos orientativos: 0 = tranquilo, 1–3 = intensidad leve, 4–6 = moderada y 7–10 = alta. Nunca afirmar que una cifra determina automáticamente si un niño «puede controlarse»; son referencias flexibles.

**Pantalla 3: Lo noto en mi cuerpo.** Tarjetas seleccionables para corazón rápido, respiración, manos tensas, barriga, calor, ganas de llorar, dolor de cabeza, etc.; permitir varias respuestas o ninguna. Usa dibujos sencillos y lenguaje respetuoso.

**Pantalla 4: Abro una ventanita.** Diseñar la interacción como **puerta/ventana ilustrada que se abre al tocar** y revele herramientas grandes y amigables, no simplemente un panel técnico. Herramientas: respirar despacio (opcional guía visual respiratoria), pausar, descansar, dibujar, hablar/pedir compañía a un adulto, abrazar un peluche, escuchar música tranquila, mover el cuerpo/caminar, beber agua. Al elegir una herramienta, ofrecer indicaciones sencillas y luego permitir **volver a medir del 0 al 10**; no exigir que la intensidad disminuya y no etiquetar como fracaso si sigue alta.

**Pantalla 5: Mi recorrido.** Mostrar **antes → estrategia elegida → después**, con opción «Volver a intentar» o «Terminar». Guardar solo en memoria durante la sesión por defecto; sin recopilar nombres, diagnósticos, historiales ni datos sensibles. Si se propone persistencia/exportación, requerir permiso explícito del profesional y describir la privacidad.

## Panel adicional para sesiones con adultos

Separado del flujo infantil, crear **dos visualizaciones distintas y pedagógicamente fieles**:

A. **«Niveles de conciencia según David R. Hawkins»**: representar su escala original desde vergüenza/culpa/apatía/pena/miedo/deseo/ira/orgullo hasta coraje, neutralidad, disposición, aceptación, razón, amor, alegría, paz e iluminación. Verificar nombres, orden y valores numéricos en una **fuente primaria de Hawkins** antes de publicar. Rotular de forma visible: «Marco filosófico/espiritual de Hawkins; no es una escala clínica o científica validada». No confundir este mapa con coma, estupor, somnolencia o niveles médicos de conciencia; tampoco inventar «tres ejes de Hawkins».

B. **«Modelo bidimensional de experiencia emocional»** de la profesional: eje X **duración**, eje Y **intensidad**, (0,0) **estado de referencia de tranquilidad**. Mostrar ejemplos de trayectorias: emoción intensa y breve, emoción moderada y persistente, emoción que disminuye después de apoyo. Los datos del gráfico deben ser **ilustrativos** o ingresados por la persona, no mediciones fingidas. Incluir una nota: «La intensidad/duración no determinan por sí solas la conciencia emocional; una emoción intensa puede experimentarse con atención y autorregulación». Rotular como «modelo conceptual de trabajo, pendiente de validación empírica». Idealmente permitir elegir una trayectoria y exportar una lámina PNG o PDF imprimible desde navegador.

Las anteriores imágenes de referencia del chat no son fuente fiable para la escala de Hawkins: verificar de nuevo antes de incorporarlas. Mantener el panel infantil y el de adultos visualmente diferenciados.

## Diseño, sonido y accesibilidad

Estilo ilustrado amable, alegre sin sobreestimular; botones grandes (aprox. ≥44px), alto contraste, letras grandes, orientación vertical y horizontal, uso con dedos, animaciones discretas con opción de reducir movimiento. Evitar la convención «emoción negativa = niño malo». Añadir textos para padres/profesionales que aclaren: pedir ayuda es válido en cualquier nivel y el objetivo es reconocer y gestionar, no suprimir emociones. Asegurar estados de foco, `aria-label`, `aria-pressed`, `aria-expanded`, feedback textual y que todo pueda utilizarse con el volumen apagado. Añadir una opción para reiniciar la sesión con confirmación simple si hay registros.

## Calidad y criterios de aceptación

- Al pulsar cada emoción se oye su **sonido propio** (cuando audio está activado), sin solapamientos, y no se reproducen sonidos inesperados al cargar la pantalla.
- El termómetro se puede arrastrar tocando directamente el tubo, por teclado y por slider; muestra valores correctos de 0 a 10.
- La ventanita realmente se abre/cierra, exhibe herramientas y permite seleccionar al menos una y reevaluar la intensidad.
- Todos los contenidos críticos se comprenden sin sonido y funcionan offline tras una instalación PWA válida.
- La app no usa seguimiento, no sube información clínica y no pide datos personales.
- Las dos láminas para adultos son distintas, con la atribución científica adecuada, y la segunda tiene exactamente eje X duración y eje Y intensidad.
- Verificar manualmente en viewport pequeño, tamaño típico de tablet e iPad, y reportar cualquier prueba no realizada en hardware real.
- No entregar solo capturas: entregar los archivos funcionales, carpeta de assets, manifest, service worker, documentación y, si es posible, enlace desplegado con instrucciones exactas (sin inventar un enlace).

## Forma de trabajar

1. Revisa el código fuente exportado, señala lo que ya existe y los defectos/pendientes.
2. Presenta una arquitectura mínima adecuada: HTML/CSS/JS modular o Vite con JavaScript (no TypeScript salvo necesidad demostrable), sin backend y sin dependencias innecesarias.
3. Implementa en orden: flujo infantil → sonidos expresivos → termómetro táctil → ventanita/reevaluación → PWA → panel adulto → pruebas.
4. Crea archivos concretos, no pseudocódigo; ejecuta build y validaciones disponibles.
5. Cierra con instrucciones de instalación en tablet, lista exacta de archivos, créditos/licencias de audio e indicación transparente de lo que falte por validar.

Si una decisión creativa no afecta la seguridad, usa buen criterio y continúa sin bloquear el proyecto con demasiadas preguntas. Si necesitas que la profesional aporte una grabación real para un sonido concreto, usa un fallback claramente identificado y explica cómo reemplazarlo.
