import { Component } from '@angular/core';
import {BackendService} from "../backend.service";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component"
import {NgIf} from "@angular/common";
// Do not remove the import below!
import {initTokenResponse, TokenClient} from "../models/gsi"
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-sign-in-or-register',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgIf],
  templateUrl: './sign-in-or-register.component.html',
  styleUrl: './sign-in-or-register.component.less'
})
export class SignInOrRegisterComponent {
  private authClientId: string = ''
  private authScopes: string = ''
  authData: string = ''
  accessToken: string | null = null
  tokenClient: any = null
  isLoggedIn: boolean = false

  constructor(private service: BackendService, private config: ConfigService) {
    config.getConfig()
      .subscribe(next => {
        this.authClientId = next.auth.google.clientId
        this.authScopes = next.auth.google.scopes
      })
  }

  ngOnInit() {
    this.initTokenClient = this.initTokenClient.bind(this)
    this.clickSignOutButton = this.clickSignOutButton.bind(this)
    this.signOutCallback = this.signOutCallback.bind(this);

    (window as any).onLoadCallback = () => {
      if ((window as any).google && (window as any).google.accounts) {
        this.initTokenClient()
      } else {
        console.error('window.google object is absent in the DOM tree!')
      }
    }

    (function (doc, tag, id) {
      var js, gjs = doc.getElementsByTagName(tag)[1];
      if (doc.getElementById(id)) {
        (window as any).onLoadCallback();
        return;
      }
      js = doc.createElement(tag); (js as any).id = id;
      (js as any).async = true;
      (js as any).defer = true;
      (js as any).onload = (window as any).onLoadCallback;
      (js as any).src = "https://accounts.google.com/gsi/client";
      (gjs as any).parentNode.insertBefore(js, gjs);
    }(document, 'script', 'gsi_lib'));

    this.service.getAccessToken()
      .subscribe(res => {
        this.accessToken = res
        this.isLoggedIn = this.service.isSignedIn()
      })
    this.service.emitter.subscribe(next => {
      this.isLoggedIn = this.service.isSignedIn()
    })
  }

  initTokenClient() {
    this.tokenClient = (window as Window).google.accounts.oauth2.initTokenClient({
      client_id: this.authClientId,
      scope: this.authScopes,
      callback: resp => {
        if ((resp != null) && (resp.access_token != null)) {
          this.accessToken = resp.access_token
          this.service.setAccessToken(resp.access_token)
          this.isLoggedIn = this.service.isSignedIn()
        }
      },
    })
  }

  clickSignInButton() {
    this.tokenClient.requestAccessToken({prompt: ''});
  }

  clickSignOutButton() {
    try {
      this.service.getAccessToken()
        .subscribe(token => {
          (window as any).google.accounts.oauth2.revoke(token, this.signOutCallback);
        })
    } catch (e: any) {
      console.error('clickSignOutButton error:')
      console.dir(e)
    }
    this.service.setAccessToken('')
  }

  signOutCallback(arg: any) {
    this.service.setAccessToken('')
  }

  login() {
    this.service.login().then(r => {
      this.authData = r
    })

  }
}
