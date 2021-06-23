import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.logintrenv == "prodbolivarconmigo") {
  document.write(
    `
      <script src="https://registro.solucionesbolivarsites.com/javascripts/basic-login-system.js">
      </script>
    `
  );
} else if (environment.logintrenv == "stgbolivarconmigo") {
  document.write(
    `
      <script src="https://stg.registro.solucionesbolivarsites.com/javascripts/basic-login-system-stg.js">
      </script>
    `
  );
} else if (environment.logintrenv == "devbolivarconmigo") {
  document.write(
    `
      <script src="https://dev.registro.solucionesbolivarsites.com/javascripts/basic-login-system-dev.js">
      </script>
    `
  );
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
