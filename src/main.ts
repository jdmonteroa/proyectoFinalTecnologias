import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';  // Importar provideHttpClient

// Modificar appConfig para agregar el proveedor de HttpClient
const customAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient()  // Agregar el proveedor de HttpClient
  ]
};

bootstrapApplication(AppComponent, customAppConfig)
  .catch((err) => console.error(err));

