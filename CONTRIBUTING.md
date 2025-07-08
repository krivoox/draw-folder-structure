# Contribuyendo a Draws Folder Structure

¡Gracias por tu interés en mejorar Draws Folder Structure! Tu contribución es esencial para mantener y mejorar la calidad de este proyecto. A continuación, encontrarás algunas pautas para participar.

## ¿Cómo puedo contribuir?

### Reportando errores

1. Asegúrate de que el error no haya sido reportado previamente [revisando los issues](https://github.com/krivoox/draw-folder-structure/issues).
2. Si el error no ha sido reportado, [crea un nuevo issue](https://github.com/krivoox/draw-folder-structure/issues/new). Proporciona una descripción detallada y, si es posible, pasos para reproducir el error.

### Sugerencias y mejoras

¡Nos encantan las sugerencias! Sigue los mismos pasos que para reportar errores, pero etiqueta tu issue como "sugerencia" o "mejora".

### Pull Requests

1. Haz fork del repositorio.
2. Crea una nueva rama con un nombre descriptivo para tu cambio.
3. Realiza tus cambios en esa rama.
4. Asegúrate de que tu código sigue las normas de estilo del proyecto y que has probado tu código.
5. Envía un pull request describiendo tus cambios. Si tu PR resuelve un issue existente, menciona el número del issue.

## Configuración del Entorno de Desarrollo

### Requisitos previos

- Node.js (versión 16 o superior)
- VS Code
- Git

### Instalación

1. Haz fork del repositorio
2. Clona tu fork localmente:

   ```bash
   git clone https://github.com/tu-usuario/draw-folder-structure.git
   cd draw-folder-structure
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. (Opcional) Configura la telemetría para testing:
   ```bash
   cp env.example .env
   # Edita .env y agrega tu connection string si quieres probar la telemetría
   ```

### Compilación y Testing

- Para compilar: `npm run compile`
- Para modo desarrollo: `npm run watch`
- Para testing: `npm run pretest`

### Variables de Entorno

Para el desarrollo, puedes usar las siguientes variables de entorno:

- `AZURE_INSIGHTS_CONNECTION_STRING`: Cadena de conexión de Azure Application Insights (opcional)

**Importante**: Nunca incluyas credenciales reales en tu código. Usa el archivo `.env` (que está en `.gitignore`) o variables de entorno del sistema.

### Estructura del Proyecto

```
src/
├── extension.ts          # Punto de entrada principal
├── services/
│   └── telemetry.ts     # Servicio de telemetría
├── functions/           # Funciones auxiliares
└── types/              # Definiciones de tipos
```

### Testing de Telemetría

La telemetría está habilitada por defecto. Para probarla:

1. Configura tu propia instancia de Azure Application Insights
2. Agrega la cadena de conexión a `.env`
3. La telemetría se activará automáticamente si se detecta una cadena de conexión válida

## Normas de estilo

- No hay estilos definidos para el codigo pero esperamos que apliques tus mejores practicas!
- Usa nombres descriptivos para variables y funciones
- Incluye comentarios en español para código complejo
- Mantén la consistencia con el código existente

## Manejo de Credenciales

### ❌ NUNCA hagas esto:

```typescript
// ❌ MAL - credenciales hardcodeadas
const connectionString = "InstrumentationKey=real-key-here...";
```

### ✅ HAZ esto:

```typescript
// ✅ BIEN - usar variables de entorno
const connectionString = process.env.AZURE_INSIGHTS_CONNECTION_STRING;
```

### Subida a Producción

Para subir cambios a producción:

1. Asegúrate de que no hay credenciales hardcodeadas en el código
2. Verifica que el archivo `.env` esté en `.gitignore`
3. Documenta cualquier nueva variable de entorno necesaria
4. Actualiza la versión en `package.json`
5. Haz un pull request con descripción detallada

## Agradecimientos

Cada contribución, por pequeña que sea, es valiosa para el desarrollo y mantenimiento de Draws Folder Structure. ¡Gracias por tomarte el tiempo para ayudar!
