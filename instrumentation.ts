export async function register() {
  // Application Insights instrumentation (optional)
  // Only load if the connection string is configured
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    try {
      const appInsights = require("applicationinsights");
      appInsights
        .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoCollectDependencies(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectExceptions(true)
        .setAutoCollectRequests(true)
        .start();
    } catch (error) {
      // Application Insights not available, continuing without monitoring
      console.warn("Application Insights not configured");
    }
  }
}
