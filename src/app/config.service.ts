import {Injectable} from '@angular/core';
import {Config} from "./models/config";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError, from} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Config | undefined = undefined

  constructor(private client: HttpClient) { }

  getConfig(): Observable<Config> {
    if (this.config) {
      return new Observable<Config>(
        subscriber => {
          subscriber.next(this.config)
          subscriber.complete()
        }
      )
    } else {
      return this.fetchConfig()
    }
  }

  fetchConfig(): Observable<Config> {
    return this.client.get<Config>('/config.json',
      {headers: {ContentType: 'application/json'}}
    )
      .pipe(
        catchError(err => throwError(()  => err)),
        map(res => {
          this.config = res as Config
          return res
        })
      )
  }
}
