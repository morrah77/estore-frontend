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
import {CatalogComponent} from "./catalog/catalog.component";

export const routes: Routes = [
  {path: '', component: HomeComponent, resolve: {userInfo: userInfoResolver},
    children: [
      {path: 'home', component: CatalogComponent},
      // {path: 'product', outlet: 'popup', children: [
      //   {path: ':id', component: ProductDetailsComponent},
      // ]},
      {path: 'about', component: StaticComponent},
      {path: 'contacts', component: StaticComponent},
      {path: 'orders', component: OrdersComponent, canActivate: [isLoggedInGuard]},
      {path: 'cart', component: CartComponent},
      {path: 'sign-in', component: SignInOrRegisterComponent},
      {path: 'sign-out', component: SignInOrRegisterComponent},
      {path: 'profile', component: UserProfileComponent, canActivate: [isLoggedInGuard]},
      {path: 'privacy-policy', component: StaticComponent},
      {path: 'terms-of-service', component: StaticComponent},
      {path: '', redirectTo: '/home', pathMatch: "full"},
    ]
  },

  {path: '', redirectTo: '/home', pathMatch: "full"},
  {path: '**', component: PageNotFoundComponent},
];
