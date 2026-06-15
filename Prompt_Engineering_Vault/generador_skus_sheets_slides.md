---
titulo: "Generador e Inyector de SKUs a Slides v13"
categoria: "Automatización"
lenguaje: "Google Apps Script"
plataformas: ["Google Sheets", "Google Slides"]
estado: "Producción"
---

# 🤖 Prompt Maestro: Inyección Dinámica Sheets a Slides

## 🎯 Contexto y Rol
Actúa como un **Ingeniero de Software experto en automatización con Google Apps Script**.
Tu objetivo es crear un sistema nativo que conecte Google Sheets con Google Slides. El script debe generar SKUs automáticamente al editar celdas y contar con una función de inyección masiva que genere diapositivas dinámicas.

---

## 🖥️ Requisitos de la Interfaz (Google Sheets)
1. **Menú Personalizado:** Crea un menú superior llamado `🚀 Automatización ESiTeF` con dos opciones: "Configurar Hoja" e "Inyectar SKUs".
2. **Setup Limpio:** La función de configuración debe limpiar la hoja (borrando datos y reglas de validación previas) y crear 6 columnas: `MARCA`, `FECHA`, `HORA`, `RED SOCIAL`, `FORMATO` y `SKU FINAL`.
3. **Formato Estricto:** Aplica formato de "texto plano" a la columna de HORA.
4. **Validación de Datos (Desplegables):**
   - **Marca:** VB, CEM, ALE, AUN
   - **Hora:** Desde "07:00" hasta "22:00" (en intervalos de una hora).
   - **Red Social:** FB, INS, X, LK, YTB
   - **Formato:** IMG, REEL, GAL, CAR

---

## ⚙️ Requisitos del Motor Lógico (Generador SKU)
* Utiliza un disparador `onEdit` para calcular el SKU automáticamente en la columna F (SKU FINAL) cada vez que se editen las columnas A a E. **No utilices fórmulas en las celdas**, todo debe ser backend puro.
* **Estructura del código:** `MARCA-AAMMDD-RED-FORMATO` (Ejemplo: `CEM-26JUN01-X-GAL`).
* **Regla estricta:** El mes debe estar en formato de 3 letras en mayúsculas (ej. JUN) y la columna de "HORA" debe **ignorarse por completo** en la construcción del código SKU.

---

## 📤 Requisitos del Inyector (Google Slides)
1. **Captura Masiva:** El script debe procesar el rango de filas activo (selección múltiple de celdas) e inyectar los datos en una presentación específica mediante su ID.
2. **Buscador de Molde:** El código no debe asumir qué slide es la plantilla. Debe iterar por toda la presentación y encontrar la diapositiva exacta que contenga el tag `{{sku}}`.
3. **Procesamiento de Textos:** En cada copia generada:
   - Reemplazar `{{sku}}` por el código de Sheets.
   - Reemplazar `{{fecha_hora}}` construyendo una cadena con el formato exacto: `Lun 01 jun- 10:00` (Día corto, día número, mes corto - hora).
4. **Procesamiento de Imágenes:** Buscar una forma (Shape) que contenga el texto `{{icono}}` y reemplazarlo utilizando `.replaceWithImage(url)`.
5. **Repositorio CDN (Anti-bloqueo):** Usa exclusivamente enlaces estables de Icons8. Mapeo: 
   - `FB` (facebook-new)
   - `INS` (instagram-new)
   - `X` (twitterx--v1)
   - `LK` (linkedin)
   - `YTB` (youtube-play)
6. **Orden Cronológico (CRÍTICO):** El bucle `for` que procesa las filas seleccionadas debe ejecutarse de forma **INVERSA** (de abajo hacia arriba) y utilizar `.move(indiceMolde + 1)`. Esto garantiza que las diapositivas generadas respeten el orden visual descendente de Sheets.
7. **Experiencia de Usuario (UX):** Añade alertas de UI de Google para manejo de errores (plantilla no encontrada, filas vacías) y notificaciones de éxito detalladas.