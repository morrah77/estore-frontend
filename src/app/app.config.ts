import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ConfigService} from "./config.service";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

function initializeAppFactory(config: ConfigService): () => Observable<any> {
  return () => config.fetchConfig()
    .pipe(
      catchError(err => throwError(()  => err)),
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      // withFetch()
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [ConfigService],
    },
  importProvidersFrom(NoopAnimationsModule)]
};
