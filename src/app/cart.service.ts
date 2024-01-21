import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from "rxjs";
import {CartEntity} from "./models/cart-entity";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartEntity[] = []
  private totalQuantity: number = 0
  @Output() emitter: EventEmitter<number> = new EventEmitter<number>()
  constructor(private storage: LocalStorageService) {
    let storedItems = JSON.parse(storage.getItem('productsInCart'))
    if (storedItems?.length && storedItems[0]?.productId) {
      this.items = storedItems
      this.totalQuantity = this.items.map((v, i, a) => v.quantity).reduce((p, n, i, a) => p + n, 0)
      this.emitter.emit(this.totalQuantity)
    }
  }

  updateProduct(productId: number, quantity: number): number {
    let result = quantity
    let qDelta = 0
    let index = this.items.findIndex(
      (value, index, obj) =>
        value.productId == productId)
    if (index >= 0) {
      if (quantity == 0) {
        qDelta = -this.items[index].quantity
        this.items.splice(index, 1)
      } else {
        qDelta = quantity - this.items[index].quantity
        this.items[index].quantity = quantity
      }
    } else {
      qDelta = quantity
      this.items.push({productId: productId, quantity: quantity} as CartEntity)
    }
    this.totalQuantity += qDelta
    this.emitter.emit(this.totalQuantity)
    if (this.items.length > 0) {
      let val = JSON.stringify(this.items)
      this.storage.setItem('productsInCart', val)
    } else {
      this.storage.removeItem('productsInCart')
    }

    return result
  }

  getTotalQuantity(): Observable<number> {
    return new Observable<number>(
      subscriber => {
        subscriber.next(this.totalQuantity)
        subscriber.complete()
      }
    )
  }

  getProductQuantity(productId: number): Observable<number> {
    return new Observable<number>(
      subscriber => {
        let item = this.items.find(
          (value, index, obj) =>
            value.productId == productId)
        if (item == undefined) {
          subscriber.next(0)
        } else {
          subscriber.next(item.quantity)
        }
        subscriber.complete()
      }
    )
  }

  getProducts(): Observable<CartEntity[]> {
    return new Observable(
      subscriber => {
        subscriber.next(Array.from(this.items))
        subscriber.complete()
      }
    )
  }
}
