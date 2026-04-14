# Monetización V2: Donaciones

## Objetivo

Implementar una estrategia de monetización inicial basada en donaciones, con UX no intrusiva y compatible con la arquitectura de notificaciones remotas.

## Alcance

- Donaciones voluntarias como primer modelo de ingresos.
- CTAs in-app mediante notificaciones remotas.
- Sin paywall ni bloqueo de funcionalidades en esta etapa.

## Hipótesis de negocio

1. Usuarios activos valoran la extensión y pueden apoyar su mantenimiento.
2. Un CTA contextual y medido en frecuencia genera mejor conversión que mensajes agresivos.
3. Transparencia sobre uso de fondos mejora la tasa de aporte.

## Tipos de CTA permitidos

- **Donación única**: enlace directo a plataforma de pagos.
- **Sponsor recurrente**: apoyo mensual opcional.
- **Apoyo no monetario**: compartir, estrella en GitHub, feedback.

## Guardrails de UX

- No mostrar CTA en primera interacción inmediata del usuario.
- No más de 1 CTA por sesión.
- No más de 2 CTAs de donación por semana.
- Siempre incluir opción “Ahora no”.
- No bloquear la operación del comando principal.

## Ubicación recomendada de mensajes

- Post-acción exitosa del comando (`generateMarkdownStructure`) con baja frecuencia.
- Activaciones espaciadas por cooldown y sin reiteración excesiva.

## Copy recomendado

- Mensaje corto y claro.
- Beneficio comunitario explícito (mantenimiento, nuevas features).
- CTA principal único para evitar fricción.

Ejemplo:

> “Si esta extensión te ahorra tiempo, puedes apoyar su continuidad con una donación.”

## KPIs iniciales (sin telemetría externa)

Para no depender de telemetría de terceros, validar resultados con señales agregadas del proveedor de pagos o repositorio:

- Número de donaciones por semana.
- Monto total mensual.
- Tasa de conversión estimada por campaña (según clics medidos en plataforma externa).
- Tasa de cancelación/ignorados observada cualitativamente (feedback/issues).

## Evolución futura

- Segmentar mensajes por canal (`stable`, `beta`) y antigüedad de versión.
- Integrar campañas temporales para releases importantes.
- Abrir camino a estrategia freemium en una etapa posterior (sin mezclar en esta fase).

## Riesgos y mitigaciones

- **Riesgo**: rechazo por mensajes repetitivos.  
  **Mitigación**: límites estrictos de frecuencia y opción de silenciado.
- **Riesgo**: percepción de presión comercial.  
  **Mitigación**: tono opcional, transparente y orientado a sostenibilidad.
- **Riesgo**: medir mal el impacto sin telemetría in-app.  
  **Mitigación**: usar métricas de plataforma de donación y ventanas de campaña bien definidas.

## Qué sigue

- Integrar con reglas de `docs/v2/remote-notifications.md`.
- Mantener consistencia con decisiones de `docs/v2/architecture.md`.
