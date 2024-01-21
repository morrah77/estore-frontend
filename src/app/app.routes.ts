import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CartComponent} from "./cart/cart.component";
import {StaticComponent} from "./static/static.component";
import {OrdersComponent} from "./orders/orders.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {isLoggedInGuard} from "./is-logged-in.guard";
import {SignInOrRegisterComponent} from "./sign-in-or-register/sign-in-or-register.component";
import {userInfoResolver} from "./user-info.resolver";
import {ProductDetailsComponent} from "./product-details/product-details.component";

export const routes: Routes = [
  {path: 'home', component: HomeComponent, resolve: {userInfo: userInfoResolver},
    // children: [
    //   {path: 'products/:id', component: ProductDetailsComponent, outlet: 'popup'}
    // ]
  },
  {path: 'about', component: StaticComponent, resolve: {userInfo: userInfoResolver}},
  {path: 'contacts', component: StaticComponent, resolve: {userInfo: userInfoResolver}},
  {path: 'orders', component: OrdersComponent, canActivate: [isLoggedInGuard], resolve: {userInfo: userInfoResolver}},
  {path: 'cart', component: CartComponent, resolve: {userInfo: userInfoResolver}},
  {path: 'sign-in', component: SignInOrRegisterComponent, resolve: {userInfo: userInfoResolver}},
  {path: 'sign-out', component: SignInOrRegisterComponent, resolve: {userInfo: userInfoResolver}},
  {path: 'profile', component: UserProfileComponent, canActivate: [isLoggedInGuard], resolve: {userInfo: userInfoResolver}},
  {path: 'privacy-policy', component: StaticComponent, resolve: {userInfo: userInfoResolver}},
  {path: 'terms-of-service', component: StaticComponent, resolve: {userInfo: userInfoResolver}},
  {path: '', redirectTo: '/home', pathMatch: "full"},
  {path: '**', component: PageNotFoundComponent},
];
