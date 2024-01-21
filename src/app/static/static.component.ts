import {Component, Input} from '@angular/core';
import {StaticService} from "../static.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";

/**
 * Displays a static page retrieved by StaticService
 * Accepts static page URL as an input parameter,
 * or takes it from the last roure segment
 * Example:
 * <a [routerLink]="['/about', {staticInfoUrl: '/about.html'}]">About</a>
 * <a [routerLink]="['/contacts']">Contacts</a>
 */
@Component({
  selector: 'app-static',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './static.component.html',
  styleUrl: './static.component.less'
})
export class StaticComponent {
  @Input() staticInfoUrl!: string
  pageContents!: string
  constructor(private service: StaticService, private route: ActivatedRoute) { }
  ngOnInit() {
    let url = this.staticInfoUrl ? this.staticInfoUrl :
      `/${this.route.snapshot.url[this.route.snapshot.url.length - 1].path}.html`
    this.service.getPageContetns(url).subscribe(
      result => {
        this.pageContents = result.toString()
      }
    )
  }
}
