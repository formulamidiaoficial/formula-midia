// Disparo dos quatro eventos de medição das ferramentas (ajuste D2).
// Funciona com GA4 (gtag) e/ou GTM (dataLayer). Se nenhum existir, não faz nada —
// seguro para publicar antes de o analytics estar montado.

export type ToolEvent = "tool_started" | "tool_completed" | "cta_whatsapp" | "email_captured";

export function trackEvent(evento: ToolEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    if (typeof w.gtag === "function") w.gtag("event", evento, params);
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: evento, ...params });
  } catch {
    /* no-op */
  }
}

// Dispara um evento apenas uma vez por instância (ex.: tool_started na primeira interação).
export function makeOnce() {
  let disparado = false;
  return (fn: () => void) => {
    if (disparado) return;
    disparado = true;
    fn();
  };
}
