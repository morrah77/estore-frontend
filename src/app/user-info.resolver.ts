import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {BackendService} from "./backend.service";
import {UserInfo} from "./models/user-info";

export const userInfoResolver: ResolveFn<UserInfo> = (route, state) => {
  return inject(BackendService).getUserInfo()
};
