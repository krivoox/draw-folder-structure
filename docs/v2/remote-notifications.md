# Notificaciones Remotas V2

## Objetivo

Diseñar un sistema de notificaciones remotas extensible, no intrusivo y desacoplado del core de la extensión, con despliegue en dos fases.

## Alcance

- Notificaciones in-app en VS Code (sin push del sistema operativo).
- Casos iniciales: donaciones, novedades del proyecto y recomendaciones.
- Evolución futura: planes pagos, anuncios segmentados y campañas.
- Sin telemetría de uso asociada a proveedores externos.

## Diseño por fases

## Fase 1: Feed remoto simple (rápida validación)

- Fuente remota: archivo JSON versionado (por ejemplo en CDN/GitHub).
- Sin backend dedicado complejo.
- Política de refresco local con TTL.
- Fallback a cache local si la red falla.

### Responsabilidades locales

- `NotificationOrchestrator`: coordina el ciclo.
- `RemoteMessageProvider`: descarga y valida payload.
- `LocalPolicyEngine`: filtra por versión, fecha y frecuencia.
- `MessageStore`: guarda estado local (seen, dismissed, snoozed).
- `MessagePresenter`: renderiza notificación con acciones.

## Fase 2: Backend dedicado

- Endpoint API con reglas dinámicas y segmentación.
- Mensajes por canal (`stable`, `beta`, `internal`).
- Capacidad para campañas y calendarización.
- Contrato compatible hacia atrás con Fase 1.

## Contrato de mensaje remoto (propuesto)

```json
{
  "id": "msg_2026_04_donations_01",
  "type": "donation",
  "priority": "medium",
  "title": "Apoya el proyecto",
  "body": "Si te resulta útil, puedes colaborar con una donación.",
  "actions": [
    { "id": "donate_now", "label": "Donar", "url": "https://example.com/donate" },
    { "id": "dismiss", "label": "Ahora no" }
  ],
  "audience": {
    "minVersion": "1.4.1",
    "channels": ["stable"],
    "platforms": ["win32", "darwin", "linux"]
  },
  "validFrom": "2026-04-01T00:00:00Z",
  "validTo": "2026-06-30T23:59:59Z",
  "cooldownHours": 168
}
```

## Reglas de elegibilidad local

- Mensaje dentro de ventana temporal `validFrom`/`validTo`.
- Versión actual de la extensión compatible.
- Canal de release coincidente.
- Mensaje no descartado permanentemente.
- Respeto de `cooldownHours`.
- Máximo configurable de mensajes por semana.

## Políticas de UX y anti-spam

- No mostrar notificaciones durante ejecución crítica del comando.
- Límite de una notificación por sesión (por defecto).
- CTA claro y opcional, nunca bloqueante.
- Opción explícita de descartar/silenciar.
- Priorizar mensajes de utilidad sobre mensajes comerciales.

## Resiliencia y errores

- Timeout corto de red (1.5s-2s).
- Si falla fetch/parse/validación: no interrumpir UX principal.
- Cache local para último feed válido.
- Reintento diferido en siguiente activación.

## Configuración sugerida en `package.json`

- `draw.folder.structure.remoteNotifications.enabled` (boolean, default `true`)
- `draw.folder.structure.remoteNotifications.channel` (string, default `stable`)
- `draw.folder.structure.remoteNotifications.maxPerWeek` (number, default `2`)
- `draw.folder.structure.remoteNotifications.feedUrl` (string, opcional)

## Qué sigue

- Alinear esta especificación con `docs/v2/architecture.md`.
- Definir criterios de monetización de donaciones en `docs/v2/monetization-donations.md`.
- Registrar retiro de telemetría en `docs/v2/deprecations.md`.
