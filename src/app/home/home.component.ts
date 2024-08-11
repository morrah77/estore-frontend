import {Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {CatalogComponent} from "../catalog/catalog.component";
import {ScrollService} from "../scroll.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, CatalogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  constructor(private service: ScrollService) {
    this.scrollListener = this.scrollListener.bind(this)
  }

  @HostListener("window:scroll", ['$event'])
  scrollListener() {
    // console.log("HomeComponent: Scroll 1")
    let obj: any = {
      "offsetHeight": window.document.documentElement.offsetHeight,
      "bodyOffsetHeight": window.document.body.offsetHeight,
      "offsetTop": window.document.documentElement.offsetTop,
      "clientHeight": window.document.documentElement.clientHeight,
      "clientTop": window.document.documentElement.clientTop,
      "scrollheight": window.document.documentElement.scrollHeight,
      "scrollTop": window.document.documentElement.scrollTop
    }
    // console.log(`offsetHeight: ${obj["offsetHeight"]}, bodyOffsetHeight: ${obj["bodyOffsetHeight"]}, offsetTop: ${obj["offsetTop"]}, clientHeight: ${obj["clientHeight"]}, clientTop: ${obj["clientTop"]}, scrollheight: ${obj["scrollheight"]}, scrollTop: ${obj["scrollTop"]}`)

    this.service.scroll(1)
  }
}
