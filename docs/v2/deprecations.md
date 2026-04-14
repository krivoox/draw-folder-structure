# Deprecaciones V2

## Objetivo

Definir el alcance y la validación de retiro total de telemetría del proyecto para la V2.

## Alcance de eliminación

### Código

- Remover uso de `TelemetryService` y `PerformanceTracker` en `src/extension.ts`.
- Eliminar archivo legado `src/functions/telemetry-service.ts` cuando no existan referencias.
- Quitar cualquier import o llamada a tracking en el flujo de comandos.

### Configuración

- Eliminar setting `draw.folder.structure.telemetry.enabled` de `package.json`.
- Eliminar flags/documentación de telemetría en archivos de configuración de ejemplo.

### Dependencias

- Remover `applicationinsights` de `dependencies` en `package.json`.
- Actualizar lockfile para reflejar la eliminación.

### Documentación

- Retirar referencias de privacidad basadas en telemetría en `README.md`.
- Marcar `AZURE_APPLICATION_INSIGHTS.md` como histórico/archivado o retirarlo del flujo activo de docs.
- Mantener docs V2 alineadas con política sin telemetría.

## Criterios de aceptación

1. No hay imports de `applicationinsights` en `src/`.
2. No hay referencias a `TelemetryService` ni `PerformanceTracker` en el código activo.
3. `package.json` no contiene settings ni dependencias de telemetría.
4. `README.md` no promete ni referencia recolección de uso.
5. Build y lint pasan sin código de telemetría.

## Checklist de verificación técnica

- Buscar referencias:
  - `telemetry`
  - `applicationinsights`
  - `TelemetryService`
  - `PerformanceTracker`
- Verificar manifiesto:
  - `contributes.configuration.properties`
  - `dependencies`
- Verificar documentación:
  - sección de privacidad
  - guías de setup operativo

## Riesgos de deprecación

- **Riesgo**: eliminar telemetría sin limpiar referencias en docs.  
  **Mitigación**: auditoría final de markdowns y README.
- **Riesgo**: ruptura de build por imports colgantes.  
  **Mitigación**: compilar inmediatamente tras retiro.
- **Riesgo**: pérdida de información para soporte técnico.  
  **Mitigación**: reforzar logging local solo para debug manual.

## Nota de transición

Durante el periodo de migración a V2, este documento se usa como fuente de verdad para validar que la eliminación de telemetría sea completa y consistente.
