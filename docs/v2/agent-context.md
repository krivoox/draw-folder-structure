# Contexto V2 para Agentes

## Propósito

Servir como documento de entrada para agentes que trabajen en la V2, con mapa del código, convenciones y criterios para extender el proyecto sin aumentar acoplamiento.

## Estado del proyecto (resumen operativo)

- Tipo de proyecto: extensión de VS Code en TypeScript.
- Entry point: `src/extension.ts`.
- Comando principal: `extension.generateMarkdownStructure`.
- Dominio actual: generación de estructura Markdown de archivos/carpetas.
- Restricción V2: retirar telemetría y diseñar capacidades remotas desacopladas.

## Mapa de archivos clave

- `src/extension.ts`
  - Activación, comando principal, interacción con VS Code.
- `src/functions/generate-structure.ts`
  - Orquesta la construcción del texto de árbol.
- `src/functions/find-files.ts`
  - Descubrimiento de rutas con `fast-glob`, exclusiones y `.gitignore`.
- `src/functions/get-prefix.ts`
  - Render de prefijos por estilo.
- `src/functions/telemetry-service.ts`
  - Componente legado; marcado para deprecación en V2.
- `package.json`
  - Manifest, configuración de usuario, comandos y dependencias.

## Flujo funcional actual

1. Usuario ejecuta comando contextual.
2. Se leen settings (`exclude`, `style`, `allowRecursion`, `respectGitignore`).
3. Se calcula árbol de archivos y se convierte a bloque Markdown.
4. Se copia al portapapeles y se abre un documento temporal en el editor.

## Arquitectura objetivo para agentes

- Mantener el comando principal como **core local**.
- Introducir notificaciones remotas como **feature opcional**:
  - `NotificationOrchestrator`
  - `RemoteMessageProvider`
  - `LocalPolicyEngine`
  - `MessageStore`
  - `MessagePresenter`
- Evitar acoplar dominio core con red, campañas o monetización.

## Glosario

- **Core**: generación de estructura Markdown, sin dependencias remotas.
- **Feature opcional**: módulo no crítico que se puede desactivar sin afectar core.
- **Fail-open**: si un módulo remoto falla, la extensión sigue operativa.
- **Cooldown**: periodo mínimo entre notificaciones equivalentes.
- **Dismiss**: descarte explícito de un mensaje por el usuario.

## Reglas para contribuir en V2

1. No mezclar lógica de notificaciones con `generateStructure`.
2. No introducir nuevas dependencias de telemetría.
3. Toda config nueva debe declararse en `package.json` con default seguro.
4. Cualquier módulo remoto debe tener timeout y fallback local.
5. Mantener contratos de datos versionables (payload de notificaciones).
6. Priorizar cambios pequeños y reversibles por fase.

## Checklist para agentes antes de abrir PR

- ¿El comando principal funciona sin red?
- ¿La nueva feature es opcional y desactivable por setting?
- ¿Se respetan límites de frecuencia de mensajes?
- ¿No se reintrodujo telemetría ni rastreo de eventos?
- ¿Se actualizó documentación de `docs/v2` afectada por el cambio?

## Referencias internas

- `docs/v2/architecture.md`
- `docs/v2/remote-notifications.md`
- `docs/v2/monetization-donations.md`
- `docs/v2/deprecations.md`
