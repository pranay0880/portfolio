export async function register() {
  // Application Insights instrumentation (optional)
  // Only load if the connection string is configured
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    try {
      // The package is optional and not a dependency; a non-literal specifier
      // keeps the bundler from trying to resolve it at build time.
      const moduleName = "applicationinsights";
      const appInsights = await import(/* webpackIgnore: true */ moduleName);
      appInsights
        .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoCollectDependencies(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .setAutoCollectRequests(true)
        .start();
    } catch {
      // Application Insights not available, continuing without monitoring
      console.warn("Application Insights not configured");
    }
  }
}
