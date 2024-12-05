import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
<<<<<<< HEAD
};
=======
};
>>>>>>> 0e6a1e318a02a9f3de91fc822967d8e15a98ba07
