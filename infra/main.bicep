// Provisions the Azure infrastructure for the portfolio site:
//   - Linux App Service Plan + Web App (Node 20 LTS) running the Next.js server
//   - Azure Database for PostgreSQL Flexible Server (Burstable B1ms)
//   - Log Analytics workspace + Application Insights for monitoring
//
// Secrets (DATABASE_URL, RESEND_API_KEY, etc.) are declared as app settings with
// placeholder values below and must be filled in after provisioning, e.g.:
//   az webapp config appsettings set -g <rg> -n <app-name> --settings RESEND_API_KEY=...
// Wiring these through Key Vault references is a recommended follow-up hardening
// step, intentionally left out of this initial pass to keep first deploy simple.

@description('Short, globally-unique-ish prefix used to name resources, e.g. "pradeep-portfolio"')
param namePrefix string

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Administrator login for the PostgreSQL Flexible Server')
param dbAdminLogin string = 'portfolioadmin'

@secure()
@description('Administrator password for the PostgreSQL Flexible Server')
param dbAdminPassword string

@description('App Service Plan SKU')
param appServicePlanSku string = 'B1'

@description('PostgreSQL Flexible Server SKU')
param dbSkuName string = 'Standard_B1ms'

var appServicePlanName = '${namePrefix}-plan'
var webAppName = '${namePrefix}-web'
var dbServerName = '${namePrefix}-pg'
var dbName = 'portfolio'
var logAnalyticsName = '${namePrefix}-logs'
var appInsightsName = '${namePrefix}-insights'

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: webAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: true
      healthCheckPath: '/api/health'
      appSettings: [
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~20' }
        { name: 'SCM_DO_BUILD_DURING_DEPLOYMENT', value: 'true' }
        { name: 'NODE_ENV', value: 'production' }
        { name: 'PORT', value: '8080' }
        { name: 'DATABASE_URL', value: 'REPLACE_ME' }
        { name: 'RESEND_API_KEY', value: 'REPLACE_ME' }
        { name: 'CONTACT_FROM_EMAIL', value: 'REPLACE_ME' }
        { name: 'CONTACT_TO_EMAIL', value: 'REPLACE_ME' }
        { name: 'NEXT_PUBLIC_SITE_URL', value: 'https://${webAppName}.azurewebsites.net' }
        { name: 'NEXT_PUBLIC_RESUME_URL', value: 'REPLACE_ME' }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
      ]
    }
  }
}

resource dbServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: dbServerName
  location: location
  sku: {
    name: dbSkuName
    tier: 'Burstable'
  }
  properties: {
    version: '16'
    administratorLogin: dbAdminLogin
    administratorLoginPassword: dbAdminPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
    }
  }
}

resource dbFirewallAllowAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: dbServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-06-01-preview' = {
  parent: dbServer
  name: dbName
}

output webAppName string = webApp.name
output webAppDefaultHostName string = webApp.properties.defaultHostName
output postgresServerFqdn string = dbServer.properties.fullyQualifiedDomainName
output applicationInsightsConnectionString string = appInsights.properties.ConnectionString
