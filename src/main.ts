import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';  // Importar provideHttpClient

// Modificar appConfig para agregar el proveedor de HttpClient
const customAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })  // Agregar el proveedor de HttpClient
  ]
};

bootstrapApplication(AppComponent, customAppConfig)
  .catch((err) => console.error(err));

