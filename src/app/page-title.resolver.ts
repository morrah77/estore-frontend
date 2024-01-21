import { ResolveFn } from '@angular/router';

export const pageTitleResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
