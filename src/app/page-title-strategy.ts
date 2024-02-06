import {Injectable} from "@angular/core";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ConfigService} from "./config.service";

const productTitlePrefix = '/home;product='

@Injectable({providedIn: 'root'})
export class PageTitleStrategy extends TitleStrategy {
  appTitle!: string
  constructor(private readonly title: Title, private config: ConfigService) {
    super();
    config.getConfig().subscribe(next => {
      this.appTitle = next.appName
    })

  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${title} | ${this.appTitle}`);
    }
  }

  override buildTitle(snapshot: RouterStateSnapshot): string | undefined {
    if (snapshot.url.startsWith(productTitlePrefix)) {
      return `Product ${snapshot.url.substring(productTitlePrefix.length)}`
    }
    let title: string = ''
    switch (snapshot.url) {
      case '/home':
        title = "Product catalog"
        break
      case '/about':
        title = "About"
        break
      case '/contacts':
        title = "Contacts"
        break
      case '/orders':
        title = "Orders"
        break
      case '/cart':
        title = "Cart"
        break
      case '/sign-in':
        title = 'Sign in'
        break;
      case '/sign-out':
        title = "Sign out"
        break
      case '/profile':
        title = "Profile"
        break
      case '/privacy-policy':
        title = "Privacy policy"
        break
      case '/terms-of-service':
        title = "Terms of service"
        break
      default:
        title = `${snapshot.url}`
    }
    return title
  }
}
