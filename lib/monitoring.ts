export async function trackEvent(name: string, properties?: Record<string, string>) {
  if (!process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) return;
  const appInsights = await import("applicationinsights");
  appInsights.defaultClient?.trackEvent({ name, properties });
}

export async function trackException(error: unknown, properties?: Record<string, string>) {
  if (!process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) return;
  const appInsights = await import("applicationinsights");
  appInsights.defaultClient?.trackException({
    exception: error instanceof Error ? error : new Error(String(error)),
    properties,
  });
}
