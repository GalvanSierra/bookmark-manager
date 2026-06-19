## Idea y visión del producto

**Problema**: Un usuario con ~15.000 bookmarks acumulados no puede gestionarlos eficientemente desde el navegador. Las operaciones de búsqueda, filtrado, des-duplicación y reorganización por carpetas son imposibles a esa escala desde la UI del navegador.

**Solución**: Un script ejecutable localmente que carga archivos de bookmarks (HTML Netscape, JSON), permite operar sobre ellos programáticamente, y los exporta de vuelta al formato original.

**Usuario objetivo**: Una sola persona. No hay usuarios externos, no hay servidor.

**Criterio de éxito**: El sistema carga el archivo de bookmarks, permite operaciones CRUD, buscar y filtrar por palabras clave con lógica AND/OR/exclusión, elimina duplicados por URL, y exporta el resultado. Si esas operaciones son confiables y reproducibles, el producto cumplió su propósito.

**Fuera del alcance deliberado**: CLI interactiva, persistencia en base de datos, interfaz.

---

## Requisitos y user stories

Como el usuario soy yo mismo, los requisitos son directamente operaciones que necesito ejecutar. No hay entrevistas de usuario, no hay incertidumbre en el dominio.

### **⭕ Historia 1 — Carga de archivo**

_Como usuario, quiero cargar un archivo HTML o JSON de bookmarks para poder operar sobre ellos en memoria._

Criterios: el sistema infiere el parser por extensión de archivo; los duplicados por URL se descartan al cargar; se reporta cuántos se cargaron y cuántos se descartaron.

### **⭕ Historia 2 — Exportación**

_Como usuario, quiero exportar un subconjunto de bookmarks a HTML o JSON, para importarlos al navegador o procesarlos después._

Criteros: el sistema infiere el parser por extensión del archivo a generar, si es HTML Netscape; se conserva la jerarquia y anidación de las carpetas. Si es JSON se usa un schema propio
Al cargar, se asigna a cada bookmark un `id` único aleatorio

### **⭕ Historia 3 — Operaciones CRUD**

_Como usuario, quiero realizar operaciones CRUD sobre subconjunto(s) de bookmarks, para su modificación y actualización._

La historia está demasiado abierta. "CRUD sobre subconjuntos" puede significar desde modificar el título de un bookmark hasta mover cientos entre carpetas. Si no defines las operaciones permitidas, terminarás agregándolas ad hoc.

Yo la escribiría así:

### ⭕ Historia 3 — Operaciones CRUD

_Como usuario, quiero realizar operaciones CRUD sobre subconjunto(s) de bookmarks, para su modificación y actualización._

: Criterios de aceptación

##### Create

- Se puede crear un bookmark indicando al menos: `url`, `title` y `folderPath`

- Se genera automáticamente un `id` único.
- Si ya existe un bookmark con la misma URL:
  - por defecto la operación falla;

##### Read

- Se puede obtener:
  - un conjunto de bookmarks mediante filtros;
  - todos los bookmarks del manager.
- Las consultas retornan copias o vistas de solo lectura para evitar modificaciones accidentales.

##### Update

- Se puede modificar: título, URL y folder

- La actualización puede aplicarse:
  - a un bookmark individual;
  - a un subconjunto obtenido mediante filtros.

- La actualización retorna la cantidad de bookmarks modificados.

##### Delete

- Se puede eliminar:
  - un bookmark por `id`;
  - un subconjunto obtenido mediante filtros.

- La operación retorna la cantidad de bookmarks eliminados.
- Los bookmarks eliminados desaparecen del manager actual en memoria.

### **⭕ Historia 4 — Búsqueda por palabras clave**

_Como usuario, quiero buscar bookmarks por palabras clave con modo OR, AND y exclusión, para extraer subconjuntos temáticos._

Criterios: búsqueda case-insensitive por defecto; se puede restringir a título, URL o carpeta; `includeAll: true` exige que todas las palabras coincidan.

### **⭕ Historia 5 — Extracción destructiva**

_Como usuario, quiero extraer un subconjunto de bookmarks moviéndolos fuera del manager principal, para redistribuirlos o exportarlos._

Criterios: los bookmarks extraídos se eliminan del servicio origen; se retornan para uso posterior.

### **⭕ Historia 6 — Procesamiento de bookmarks de manga** _(incompleta)_

_Como usuario, quiero identificar cuáles bookmarks corresponden a capítulos de manga, conservar solo el más reciente por serie, y eliminar los redundantes._

Criterios pendientes de definir: ¿qué pasa con los bookmarks que no coinciden con ningún dominio configurado? ¿Se conservan intactos o se procesan por separado? ¿El resultado actualiza el manager original o se exporta por separado?

**Estado real**: el `MangaService` implementa parsing y selección del capítulo más reciente, pero el flujo completo — desde carga hasta actualización del `BookmarkManager` — no está orquestado en ningún lugar.

---
