import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, UrlTree} from "@angular/router";
import {userInfoResolver} from "../user-info.resolver";
import {Observable} from "rxjs";
import {isLoggedInGuard} from "../is-logged-in.guard";
import {NgIf} from "@angular/common";
import {CartService} from "../cart.service";
import {BackendService} from "../backend.service";
import {UserInfo} from "../models/user-info";
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent {
  public appName!: string
  public userName!: Observable<string> | Promise<string> | string
  public isLoggedIn!: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  public itemsInCartQuantity: number = 0
  constructor(private route: ActivatedRoute, private router: Router,
              private cartService: CartService, private backend: BackendService,
              private config: ConfigService) {

  }

  ngOnInit() {
    this.cartService.getTotalQuantity()
      .subscribe(next => {
        this.itemsInCartQuantity = next
      })
    this.cartService.emitter.subscribe(next => {
      this.itemsInCartQuantity = next
    })
    this.route.data.subscribe(({userInfo}) => {
      this.setUserInfo(userInfo)
    })
    this.backend.emitter.subscribe(next => {
      this.setUserInfo(next)
    })
    this.config.getConfig().subscribe(
      next => {
        this.appName = next.appName
      }
    )
  }

  setUserInfo(info: UserInfo | undefined) {
    if (info) {
      this.userName = info.name
      this.isLoggedIn = true
    } else {
      this.userName = ''
      this.isLoggedIn = false
    }
  }

}
