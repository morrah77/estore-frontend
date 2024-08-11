import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {Product} from "./models/product";
import {Category} from "./models/category";
import {UserInfo} from "./models/user-info";
import {Order} from "./models/order";
import {LocalStorageService} from "./local-storage.service";
import {ConfigService} from "./config.service";
import {CheckoutSessionSecret} from "./models/checkout-session-secret";
import {CheckoutSession} from "./models/checkout-session";
import {CheckoutOrder} from "./models/checkout-order";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private accessToken: string = ''
  private apiUrl: String = 'http://localhost:4200/api'
  private userInfo: UserInfo | undefined = undefined
  @Output() emitter: EventEmitter<UserInfo | undefined> = new EventEmitter<UserInfo | undefined>()

  constructor(private client: HttpClient, private storage: LocalStorageService, private config: ConfigService) {
    this.resetAuthAndUserInfo = this.resetAuthAndUserInfo.bind(this)
    this.fetchUserInfo = this.fetchUserInfo.bind(this)

    let storedToken = storage.getItem('accessToken')
    if (storedToken?.length) {
      this.accessToken = storedToken
    }
    config.getConfig()
      .subscribe(next => {
        this.apiUrl = next.apiUrl
      })
  }

  authorizedHeaders(): {headers:  HttpHeaders | {[p: string]: string | string[]}} {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`
      },
    }
  }

  getAccessToken(): Observable<string> {
    return new Observable<string>(subscriber => {
      subscriber.next(this.accessToken)
      subscriber.complete()
    })
  }

  setAccessToken(token: string) {
    this.accessToken = token
    if (this.accessToken.length > 0) {
      this.storage.setItem('accessToken', this.accessToken)
    } else {
      this.storage.removeItem('accessToken')
    }
    this.fetchUserInfo().subscribe()
  }

  isSignedIn(): boolean {
    return this.accessToken.length > 0
  }

  resetAuthAndUserInfo() {
    this.storage.removeItem('accessToken')
    this.userInfo = undefined
    this.emitter.emit(this.userInfo)
  }

  emptyObservable(): Observable<undefined> {
    return new Observable<undefined>(
      subscriber => {
        subscriber.next(undefined)
        subscriber.complete()
      }
    )
  }

  createCheckoutSession(order: CheckoutOrder): Observable<CheckoutSessionSecret | undefined> {
    return this.client.post<CheckoutSessionSecret>(`${this.apiUrl}/checkout/session`,
      JSON.stringify(order), this.authorizedHeaders())
      .pipe(
        catchError(err => {
          console.error(err)
          return this.emptyObservable()
        }),
        tap(res => console.dir(res))
      )
  }

  getCheckoutSessionStatus(sessionId: string): Observable<CheckoutSession | undefined> {
    return this.client.get<CheckoutSession>(`${this.apiUrl}/checkout/session?session_id=${sessionId}`,
      this.authorizedHeaders())
      .pipe(
        catchError(err => {
          console.error(err)
          return this.emptyObservable()
        }),
        tap(res => console.dir(res))
      )
  }

  fetchUserInfo(): Observable<UserInfo | undefined> {
    if (!this.accessToken || this.accessToken?.length <= 0) {
      this.resetAuthAndUserInfo()
      return this.emptyObservable()
    }
    return this.client.get<UserInfo>(`${this.apiUrl}/user`, this.authorizedHeaders())
      .pipe(
        catchError(err => {
          console.error(`Caught an error: ${err}`)
          console.dir(err)
          this.resetAuthAndUserInfo()
          return this.emptyObservable()
        }),
        tap(res => {
          this.userInfo = res as UserInfo
          this.emitter.emit(this.userInfo)
        }),
        )
  }

  getUserInfo(): Observable<UserInfo | undefined> {
    if (!this.accessToken) {
      this.resetAuthAndUserInfo()
      return this.emptyObservable()
    }
    if (this.userInfo) {
      return new Observable<UserInfo>(
        subscriber => {
          subscriber.next(this.userInfo)
          subscriber.complete()
        })
    } else {
      return this.fetchUserInfo()
    }
  }

  getProducts(offset: number = 0, limit: number = 5, categoryIds: number[] = [], phrase: string = ''): Observable<Product[]> {
    let query: string = ''
    if (categoryIds.length) {
      query += `&categoryIds=${categoryIds.join(',')}`
    }
    if (phrase.length) {
      query += `&search=${phrase}`
    }
    return this.client.get<Product[]>(`${this.apiUrl}/products?limit=${limit}&offset=${offset}${query}`)
  }

  getCategories(): Observable<Category[]> {
    return this.client.get<Category[]>(`${this.apiUrl}/categories`)
  }

  // getProductsInCategory(categoryId: number, offset: number = 0, limit: number = 5): Observable<Product[]> {
  //   return this.client.get<Product[]>(`${this.apiUrl}/products?categoryIds=${categoryId}&limit=${limit}&offset=${offset}`)
  // }
  //
  // searchProducts(phrase: string, offset: number = 0, limit: number = 5): Observable<Product[]> {
  //   return this.client.get<Product[]>(`${this.apiUrl}/products?search=${phrase}&limit=${limit}&offset=${offset}`)
  // }

  getProduct(id: number): Observable<Product> {
    return this.client.get<Product>(`${this.apiUrl}/products/${id}`)
  }

  getOrders(limit?: number | null, offset?: number | null, orderBy?: string, order?: string): Observable<Order[]> {

    let params = new HttpParams()
    if (limit != null) {
      params = params.set('limit', limit)
    }
    if (offset != null) {
      params = params.set('offset', offset)
    }
    if (orderBy) {
      console.log(`setting orderBy ${orderBy}`)
      params = params.set('orderBy', orderBy)
    }
    if (order) {
      console.log(`setting order ${order}`)
      params = params.set('order', order)
    }
    let opts = {...this.authorizedHeaders(), ...{params: params}}
    console.log('opts')
    console.dir(opts)
    return this.client.get<Order[]>(`${this.apiUrl}/orders`,
      opts
    )
  }

  addOrder(order: Order): Observable<Order | undefined> {
    return this.client.post<Order>(`${this.apiUrl}/orders`,
      order,
      this.authorizedHeaders())
      .pipe(
        catchError(err => {
          console.error(`Caught an error: ${err}`)
          console.dir(err)
          return this.emptyObservable()
        }
      ),
      tap(res => {
        console.log('addOrder response:')
        console.dir(res)
      })
      )
  }

  // No way to use the classic HTTP redirect approach for OAuth2 authentication in an SPA :(
  // due to the browser CORS safety standards: even results of a JS fetch with `no-cors` req type converts to opaque
  // so their responses are discarded
  // TODO consider implementing own component with popup windows and callbacks to provide more auth options
  // (currently Google auth is only available)
  login(): Promise<string> {
    return Promise.resolve('Not implemented yet :(')
  }

}
