import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class StaticService {
  private staticPagesUrl: string = '/assets'
  constructor(private client: HttpClient, private config: ConfigService) {
    config.getConfig()
      .subscribe(next => {
        this.staticPagesUrl = next.staticPagesUrl
      })
  }

  getPageContetns(path: string): Observable<String> {
    let url = this.staticPagesUrl + path
    return this.client.get(url, {responseType: 'text'}).pipe(result => (<Observable<String>>result))
  }
}
