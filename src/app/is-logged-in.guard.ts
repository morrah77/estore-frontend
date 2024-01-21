import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {BackendService} from "./backend.service";

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  return inject(BackendService).isSignedIn();
};
